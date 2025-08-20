"""
Advanced NLP Processing for Medical Documents - VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import re
import json
import spacy
import nltk
from typing import Dict, Any, List, Tuple, Optional
from datetime import datetime, timedelta
import structlog
from dataclasses import dataclass
from enum import Enum

# Medical NLP imports
try:
    import medspacy
    import scispacy
    MEDICAL_NLP_AVAILABLE = True
except ImportError:
    MEDICAL_NLP_AVAILABLE = False

# Spanish NLP support
try:
    from spacy.lang.es import Spanish
    SPANISH_SUPPORT = True
except ImportError:
    SPANISH_SUPPORT = False

logger = structlog.get_logger(__name__)

class UrgencyLevel(Enum):
    CRITICAL = "critico"
    HIGH = "alto"
    MEDIUM = "medio"
    LOW = "bajo"
    ROUTINE = "rutina"

class DocumentType(Enum):
    EPICRISIS = "epicrisis"
    LAB_RESULT = "laboratorio"
    IMAGING = "imagen"
    PRESCRIPTION = "receta"
    REFERRAL = "remision"
    CONSULTATION = "consulta"
    PROCEDURE = "procedimiento"
    DISCHARGE = "alta"

@dataclass
class MedicalEntity:
    text: str
    label: str
    confidence: float
    start: int
    end: int
    normalized: Optional[str] = None

@dataclass
class PatientInfo:
    name: Optional[str] = None
    document_id: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    birth_date: Optional[datetime] = None
    insurance: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

@dataclass
class MedicalInfo:
    primary_diagnosis: Optional[str] = None
    secondary_diagnoses: List[str] = None
    symptoms: List[str] = None
    medications: List[str] = None
    procedures: List[str] = None
    allergies: List[str] = None
    vital_signs: Dict[str, str] = None
    lab_values: Dict[str, str] = None

@dataclass
class ReferralInfo:
    specialty: Optional[str] = None
    urgency: UrgencyLevel = UrgencyLevel.MEDIUM
    reason: Optional[str] = None
    requesting_physician: Optional[str] = None
    requesting_institution: Optional[str] = None
    preferred_date: Optional[datetime] = None
    clinical_summary: Optional[str] = None

class AdvancedMedicalNLP:
    """
    Advanced NLP processor for medical documents with Spanish language support
    """
    
    def __init__(self):
        self.logger = logger.bind(component="advanced_nlp")
        self.nlp_es = None
        self.nlp_en = None
        self.medical_nlp = None
        
        # Initialize NLP models
        self._initialize_models()
        
        # Medical terminology dictionaries
        self.medical_terms = self._load_medical_terminology()
        self.specialty_mapping = self._load_specialty_mapping()
        self.urgency_keywords = self._load_urgency_keywords()
        
        # Regex patterns for medical information
        self.patterns = self._compile_medical_patterns()
    
    def _initialize_models(self):
        """Initialize SpaCy and medical NLP models"""
        try:
            # Load Spanish model
            if SPANISH_SUPPORT:
                try:
                    self.nlp_es = spacy.load("es_core_news_sm")
                    self.logger.info("Spanish NLP model loaded successfully")
                except OSError:
                    self.logger.warning("Spanish model not found, using basic Spanish")
                    self.nlp_es = Spanish()
            
            # Load English model as fallback
            try:
                self.nlp_en = spacy.load("en_core_web_sm")
                self.logger.info("English NLP model loaded successfully")
            except OSError:
                self.logger.warning("English model not found")
            
            # Load medical NLP if available
            if MEDICAL_NLP_AVAILABLE:
                try:
                    self.medical_nlp = medspacy.load("es_core_news_sm")
                    self.logger.info("Medical NLP model loaded successfully")
                except:
                    self.logger.warning("Medical NLP model not available")
                    
        except Exception as e:
            self.logger.error("Failed to initialize NLP models", error=str(e))
    
    def _load_medical_terminology(self) -> Dict[str, List[str]]:
        """Load medical terminology dictionaries"""
        return {
            "symptoms": [
                "dolor", "fiebre", "nausea", "vomito", "diarrea", "estreñimiento",
                "fatiga", "debilidad", "mareo", "cefalea", "tos", "disnea",
                "palpitaciones", "edema", "rash", "prurito", "vision borrosa"
            ],
            "body_parts": [
                "cabeza", "cuello", "torax", "abdomen", "pelvis", "extremidades",
                "corazon", "pulmones", "higado", "riñones", "cerebro", "columna",
                "rodilla", "hombro", "cadera", "tobillo", "muñeca", "codo"
            ],
            "procedures": [
                "cirugia", "biopsia", "endoscopia", "cateterismo", "dialisis",
                "quimioterapia", "radioterapia", "fisioterapia", "rehabilitacion",
                "transplante", "implante", "protesis", "marcapasos"
            ],
            "medications": [
                "antibiotico", "analgesico", "antiinflamatorio", "antihipertensivo",
                "diuretico", "broncodilatador", "corticoide", "insulina",
                "anticoagulante", "anticonvulsivo", "antidepresivo", "sedante"
            ],
            "specialties": [
                "cardiologia", "neurologia", "gastroenterologia", "neumologia",
                "nefrologia", "endocrinologia", "hematologia", "oncologia",
                "psiquiatria", "dermatologia", "oftalmologia", "otorrinolaringologia",
                "urologia", "ginecologia", "pediatria", "geriatria", "cirugia"
            ]
        }
    
    def _load_specialty_mapping(self) -> Dict[str, str]:
        """Load specialty name mappings and synonyms"""
        return {
            "cardio": "cardiologia",
            "neuro": "neurologia",
            "gastro": "gastroenterologia",
            "pneumo": "neumologia",
            "nefro": "nefrologia",
            "endocrino": "endocrinologia",
            "hemato": "hematologia",
            "onco": "oncologia",
            "psiquiatra": "psiquiatria",
            "dermato": "dermatologia",
            "oftalmo": "oftalmologia",
            "otorrino": "otorrinolaringologia",
            "uro": "urologia",
            "gineco": "ginecologia",
            "pedia": "pediatria",
            "geria": "geriatria",
            "cirugia general": "cirugia",
            "medicina interna": "medicina_interna",
            "medicina familiar": "medicina_familiar"
        }
    
    def _load_urgency_keywords(self) -> Dict[UrgencyLevel, List[str]]:
        """Load urgency level keywords"""
        return {
            UrgencyLevel.CRITICAL: [
                "critico", "emergencia", "urgente", "inmediato", "stat",
                "codigo azul", "codigo rojo", "paro", "shock", "coma",
                "hemorragia", "infarto", "avc", "trauma grave"
            ],
            UrgencyLevel.HIGH: [
                "prioritario", "urgente", "pronto", "rapido", "importante",
                "severo", "grave", "agudo", "descompensado", "inestable"
            ],
            UrgencyLevel.MEDIUM: [
                "moderado", "estable", "controlado", "seguimiento",
                "valoracion", "evaluacion", "consulta", "revision"
            ],
            UrgencyLevel.LOW: [
                "rutina", "programado", "electivo", "control", "preventivo",
                "chequeo", "revision anual", "screening", "tamizaje"
            ],
            UrgencyLevel.ROUTINE: [
                "rutina", "normal", "regular", "habitual", "periodico",
                "mantenimiento", "seguimiento rutinario"
            ]
        }
    
    def _compile_medical_patterns(self) -> Dict[str, List[re.Pattern]]:
        """Compile regex patterns for medical information extraction"""
        return {
            "patient_id": [
                re.compile(r"(?:cedula|cc|documento|identificacion)[\s:]*(\d{6,12})", re.IGNORECASE),
                re.compile(r"(?:numero de documento)[\s:]*(\d{6,12})", re.IGNORECASE),
                re.compile(r"(?:id|identificacion)[\s:]*(\d{6,12})", re.IGNORECASE)
            ],
            "patient_name": [
                re.compile(r"(?:paciente|nombre)[\s:]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)", re.IGNORECASE),
                re.compile(r"(?:apellidos y nombres)[\s:]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)", re.IGNORECASE)
            ],
            "age": [
                re.compile(r"(?:edad)[\s:]*(\d{1,3})(?:\s*años?)?", re.IGNORECASE),
                re.compile(r"(\d{1,3})\s*años?", re.IGNORECASE)
            ],
            "diagnosis": [
                re.compile(r"(?:diagnostico|dx)[\s:]*([^.\n]+)", re.IGNORECASE),
                re.compile(r"(?:impresion diagnostica)[\s:]*([^.\n]+)", re.IGNORECASE),
                re.compile(r"(?:cie-?10?)[\s:]*([A-Z]\d{2}\.?\d?)", re.IGNORECASE)
            ],
            "medications": [
                re.compile(r"(?:medicamentos?|farmacos?)[\s:]*([^.\n]+)", re.IGNORECASE),
                re.compile(r"(?:tratamiento)[\s:]*([^.\n]+)", re.IGNORECASE),
                re.compile(r"(\w+)\s+(\d+(?:\.\d+)?)\s*(mg|ml|gr|ui|mcg)", re.IGNORECASE)
            ],
            "vital_signs": [
                re.compile(r"(?:presion arterial|pa)[\s:]*(\d{2,3}/\d{2,3})", re.IGNORECASE),
                re.compile(r"(?:frecuencia cardiaca|fc)[\s:]*(\d{2,3})", re.IGNORECASE),
                re.compile(r"(?:temperatura|temp)[\s:]*(\d{2}\.\d)", re.IGNORECASE),
                re.compile(r"(?:saturacion|spo2)[\s:]*(\d{2,3})%?", re.IGNORECASE)
            ],
            "dates": [
                re.compile(r"(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})", re.IGNORECASE),
                re.compile(r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", re.IGNORECASE)
            ],
            "phone": [
                re.compile(r"(?:telefono|tel|celular|movil)[\s:]*(\d{10})", re.IGNORECASE),
                re.compile(r"(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})", re.IGNORECASE)
            ],
            "insurance": [
                re.compile(r"(?:eps|ips|seguro)[\s:]*([^.\n]+)", re.IGNORECASE),
                re.compile(r"(?:aseguradora|entidad)[\s:]*([^.\n]+)", re.IGNORECASE)
            ]
        }
    
    def process_medical_document(self, text: str, document_type: str = None) -> Dict[str, Any]:
        """
        Main method to process medical documents and extract structured information
        """
        try:
            self.logger.info("Processing medical document", doc_type=document_type)
            
            # Clean and preprocess text
            cleaned_text = self._preprocess_text(text)
            
            # Extract basic information using regex
            basic_info = self._extract_basic_information(cleaned_text)
            
            # Extract medical entities using NLP
            medical_entities = self._extract_medical_entities(cleaned_text)
            
            # Classify document type if not provided
            if not document_type:
                document_type = self._classify_document_type(cleaned_text)
            
            # Extract specialized information based on document type
            specialized_info = self._extract_specialized_info(cleaned_text, document_type)
            
            # Determine urgency level
            urgency = self._determine_urgency(cleaned_text)
            
            # Extract referral information
            referral_info = self._extract_referral_info(cleaned_text)
            
            # Combine all extracted information
            result = {
                "document_type": document_type,
                "urgency_level": urgency.value,
                "patient_info": basic_info.get("patient", {}),
                "medical_info": basic_info.get("medical", {}),
                "referral_info": referral_info,
                "entities": medical_entities,
                "specialized_info": specialized_info,
                "processing_metadata": {
                    "processed_at": datetime.now().isoformat(),
                    "text_length": len(text),
                    "confidence_score": self._calculate_confidence_score(basic_info, medical_entities)
                }
            }
            
            self.logger.info("Document processing completed", 
                           doc_type=document_type, 
                           entities_found=len(medical_entities))
            
            return result
            
        except Exception as e:
            self.logger.error("Document processing failed", error=str(e))
            return {"error": str(e), "processed_at": datetime.now().isoformat()}
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for better extraction"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Normalize common medical abbreviations
        abbreviations = {
            r'\bDx\b': 'Diagnostico',
            r'\bTx\b': 'Tratamiento',
            r'\bHx\b': 'Historia',
            r'\bPx\b': 'Paciente',
            r'\bPA\b': 'Presion Arterial',
            r'\bFC\b': 'Frecuencia Cardiaca',
            r'\bFR\b': 'Frecuencia Respiratoria',
            r'\bTemp\b': 'Temperatura'
        }
        
        for abbrev, full_form in abbreviations.items():
            text = re.sub(abbrev, full_form, text, flags=re.IGNORECASE)
        
        return text.strip()
    
    def _extract_basic_information(self, text: str) -> Dict[str, Any]:
        """Extract basic patient and medical information using regex"""
        patient_info = {}
        medical_info = {}
        
        # Extract patient information
        for field, patterns in self.patterns.items():
            if field.startswith("patient_"):
                field_name = field.replace("patient_", "")
                for pattern in patterns:
                    match = pattern.search(text)
                    if match:
                        patient_info[field_name] = match.group(1).strip()
                        break
            elif field in ["age", "phone", "insurance"]:
                for pattern in patterns:
                    match = pattern.search(text)
                    if match:
                        patient_info[field] = match.group(1).strip()
                        break
            elif field in ["diagnosis", "medications", "vital_signs"]:
                matches = []
                for pattern in patterns:
                    matches.extend(pattern.findall(text))
                if matches:
                    medical_info[field] = matches
        
        return {"patient": patient_info, "medical": medical_info}
    
    def _extract_medical_entities(self, text: str) -> List[MedicalEntity]:
        """Extract medical entities using NLP models"""
        entities = []
        
        try:
            # Use Spanish model if available
            nlp_model = self.nlp_es or self.nlp_en
            if not nlp_model:
                return entities
            
            doc = nlp_model(text)
            
            # Extract named entities
            for ent in doc.ents:
                entity = MedicalEntity(
                    text=ent.text,
                    label=ent.label_,
                    confidence=0.8,  # Default confidence
                    start=ent.start_char,
                    end=ent.end_char
                )
                entities.append(entity)
            
            # Extract medical terms using custom dictionaries
            for category, terms in self.medical_terms.items():
                for term in terms:
                    pattern = re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE)
                    for match in pattern.finditer(text):
                        entity = MedicalEntity(
                            text=match.group(),
                            label=f"MEDICAL_{category.upper()}",
                            confidence=0.9,
                            start=match.start(),
                            end=match.end(),
                            normalized=term
                        )
                        entities.append(entity)
            
        except Exception as e:
            self.logger.error("Entity extraction failed", error=str(e))
        
        return entities
    
    def _classify_document_type(self, text: str) -> str:
        """Classify document type based on content"""
        text_lower = text.lower()
        
        type_indicators = {
            DocumentType.EPICRISIS: ["epicrisis", "resumen", "alta", "egreso"],
            DocumentType.LAB_RESULT: ["laboratorio", "resultado", "hemograma", "quimica"],
            DocumentType.IMAGING: ["radiografia", "tomografia", "resonancia", "ecografia"],
            DocumentType.PRESCRIPTION: ["receta", "medicamentos", "prescripcion"],
            DocumentType.REFERRAL: ["remision", "interconsulta", "referencia"],
            DocumentType.CONSULTATION: ["consulta", "valoracion", "evaluacion"],
            DocumentType.PROCEDURE: ["procedimiento", "cirugia", "intervencion"],
            DocumentType.DISCHARGE: ["alta", "egreso", "salida"]
        }
        
        scores = {}
        for doc_type, indicators in type_indicators.items():
            score = sum(1 for indicator in indicators if indicator in text_lower)
            if score > 0:
                scores[doc_type] = score
        
        if scores:
            return max(scores, key=scores.get).value
        else:
            return "documento_general"
    
    def _extract_specialized_info(self, text: str, document_type: str) -> Dict[str, Any]:
        """Extract specialized information based on document type"""
        specialized_info = {}
        
        if document_type == DocumentType.LAB_RESULT.value:
            specialized_info = self._extract_lab_values(text)
        elif document_type == DocumentType.IMAGING.value:
            specialized_info = self._extract_imaging_findings(text)
        elif document_type == DocumentType.PRESCRIPTION.value:
            specialized_info = self._extract_prescription_details(text)
        elif document_type == DocumentType.EPICRISIS.value:
            specialized_info = self._extract_epicrisis_details(text)
        
        return specialized_info
    
    def _extract_lab_values(self, text: str) -> Dict[str, Any]:
        """Extract laboratory values and results"""
        lab_patterns = {
            "hemoglobina": r"(?:hemoglobina|hb)[\s:]*(\d+\.?\d*)",
            "glucosa": r"(?:glucosa|glicemia)[\s:]*(\d+\.?\d*)",
            "creatinina": r"(?:creatinina)[\s:]*(\d+\.?\d*)",
            "colesterol": r"(?:colesterol)[\s:]*(\d+\.?\d*)",
            "trigliceridos": r"(?:trigliceridos)[\s:]*(\d+\.?\d*)"
        }
        
        lab_values = {}
        for test, pattern in lab_patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                lab_values[test] = match.group(1)
        
        return {"lab_values": lab_values}
    
    def _extract_imaging_findings(self, text: str) -> Dict[str, Any]:
        """Extract imaging study findings"""
        findings = []
        
        finding_patterns = [
            r"(?:hallazgos?)[\s:]*([^.\n]+)",
            r"(?:impresion?)[\s:]*([^.\n]+)",
            r"(?:conclusion?)[\s:]*([^.\n]+)"
        ]
        
        for pattern in finding_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            findings.extend(matches)
        
        return {"imaging_findings": findings}
    
    def _extract_prescription_details(self, text: str) -> Dict[str, Any]:
        """Extract prescription medication details"""
        medications = []
        
        # Pattern for medication with dosage
        med_pattern = r"(\w+)\s+(\d+(?:\.\d+)?)\s*(mg|ml|gr|ui|mcg)(?:\s+cada\s+(\d+)\s*(horas?|h))?(?:\s+por\s+(\d+)\s*(dias?|d))?"
        
        matches = re.findall(med_pattern, text, re.IGNORECASE)
        for match in matches:
            medication = {
                "name": match[0],
                "dose": match[1],
                "unit": match[2],
                "frequency": f"cada {match[3]} {match[4]}" if match[3] else None,
                "duration": f"{match[5]} {match[6]}" if match[5] else None
            }
            medications.append(medication)
        
        return {"medications": medications}
    
    def _extract_epicrisis_details(self, text: str) -> Dict[str, Any]:
        """Extract epicrisis-specific information"""
        epicrisis_info = {}
        
        # Extract admission and discharge dates
        date_patterns = [
            r"(?:ingreso|admision)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"(?:egreso|alta)[\s:]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
        ]
        
        for i, pattern in enumerate(date_patterns):
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                key = "admission_date" if i == 0 else "discharge_date"
                epicrisis_info[key] = match.group(1)
        
        # Extract evolution summary
        evolution_pattern = r"(?:evolucion|curso)[\s:]*([^.\n]{50,})"
        match = re.search(evolution_pattern, text, re.IGNORECASE)
        if match:
            epicrisis_info["evolution"] = match.group(1).strip()
        
        return epicrisis_info
    
    def _determine_urgency(self, text: str) -> UrgencyLevel:
        """Determine urgency level based on text content"""
        text_lower = text.lower()
        
        urgency_scores = {}
        for level, keywords in self.urgency_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                urgency_scores[level] = score
        
        if urgency_scores:
            return max(urgency_scores, key=urgency_scores.get)
        else:
            return UrgencyLevel.MEDIUM
    
    def _extract_referral_info(self, text: str) -> Dict[str, Any]:
        """Extract referral-specific information"""
        referral_info = {}
        
        # Extract specialty
        for specialty in self.medical_terms["specialties"]:
            if specialty in text.lower():
                referral_info["specialty"] = specialty
                break
        
        # Check specialty mappings
        for abbrev, full_specialty in self.specialty_mapping.items():
            if abbrev in text.lower():
                referral_info["specialty"] = full_specialty
                break
        
        # Extract requesting physician
        physician_patterns = [
            r"(?:solicita|refiere|dr|dra)[\s.]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)",
            r"(?:medico tratante)[\s:]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)"
        ]
        
        for pattern in physician_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                referral_info["requesting_physician"] = match.group(1).strip()
                break
        
        # Extract reason for referral
        reason_patterns = [
            r"(?:motivo|razon)[\s:]*([^.\n]+)",
            r"(?:para)[\s:]*([^.\n]+)"
        ]
        
        for pattern in reason_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                referral_info["reason"] = match.group(1).strip()
                break
        
        return referral_info
    
    def _calculate_confidence_score(self, basic_info: Dict, entities: List[MedicalEntity]) -> float:
        """Calculate overall confidence score for extraction"""
        score = 0.0
        total_weight = 0.0
        
        # Weight for basic information
        patient_fields = len(basic_info.get("patient", {}))
        medical_fields = len(basic_info.get("medical", {}))
        
        if patient_fields > 0:
            score += 0.3 * min(1.0, patient_fields / 5)  # Max 5 patient fields
            total_weight += 0.3
        
        if medical_fields > 0:
            score += 0.4 * min(1.0, medical_fields / 3)  # Max 3 medical fields
            total_weight += 0.4
        
        # Weight for entities
        if entities:
            avg_entity_confidence = sum(e.confidence for e in entities) / len(entities)
            score += 0.3 * avg_entity_confidence
            total_weight += 0.3
        
        return score / total_weight if total_weight > 0 else 0.0
