"""
Medical Classification Module for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import re
import json
from typing import Dict, Any, List, Tuple, Optional
from datetime import datetime
import structlog

# NLP imports
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    NLTK_AVAILABLE = True
except ImportError:
    NLTK_AVAILABLE = False

from config import EMAIL_CONFIG, MEDICAL_PATTERNS

logger = structlog.get_logger(__name__)

class MedicalClassifier:
    """
    Medical document and email classification system
    """
    
    def __init__(self):
        self.logger = logger.bind(component="medical_classifier")
        self.referral_keywords = EMAIL_CONFIG["REFERRAL_KEYWORDS"]
        self.medical_specialties = EMAIL_CONFIG["MEDICAL_SPECIALTIES"]
        self.priority_keywords = EMAIL_CONFIG["PRIORITY_KEYWORDS"]
        
        # Initialize NLP tools
        self._initialize_nlp()
        
        # Medical document types
        self.document_types = {
            'epicrisis': [
                'epicrisis', 'resumen', 'alta', 'egreso', 'salida',
                'discharge', 'summary', 'clinical summary'
            ],
            'laboratorio': [
                'laboratorio', 'lab', 'analisis', 'resultado',
                'hemograma', 'quimica', 'urinalisis', 'cultivo'
            ],
            'imagen': [
                'radiografia', 'rx', 'tomografia', 'tac', 'resonancia',
                'ecografia', 'ultrasonido', 'mamografia', 'imagen'
            ],
            'historia_clinica': [
                'historia', 'clinica', 'expediente', 'record',
                'antecedentes', 'evolucion'
            ],
            'interconsulta': [
                'interconsulta', 'consulta', 'valoracion',
                'evaluacion', 'concepto', 'opinion'
            ],
            'procedimiento': [
                'procedimiento', 'cirugia', 'operacion', 'intervencion',
                'biopsia', 'endoscopia', 'cateterismo'
            ],
            'medicamentos': [
                'medicamentos', 'farmacia', 'prescripcion', 'receta',
                'tratamiento', 'terapia', 'dosis'
            ]
        }
        
        # Medical urgency indicators
        self.urgency_indicators = {
            'alta': [
                'urgente', 'emergencia', 'critico', 'grave', 'severo',
                'inmediato', 'stat', 'codigo', 'shock', 'paro',
                'infarto', 'avc', 'trauma', 'politrauma'
            ],
            'media': [
                'prioritario', 'pronto', 'temprano', 'moderado',
                'importante', 'significativo', 'atencion'
            ],
            'baja': [
                'rutina', 'programado', 'electivo', 'normal',
                'control', 'seguimiento', 'revision'
            ]
        }
    
    def _initialize_nlp(self):
        """Initialize NLP libraries"""
        try:
            if SPACY_AVAILABLE:
                # Try to load Spanish model
                try:
                    self.nlp = spacy.load("es_core_news_sm")
                    self.spacy_available = True
                    self.logger.info("SpaCy Spanish model loaded successfully")
                except OSError:
                    try:
                        # Fallback to English model
                        self.nlp = spacy.load("en_core_web_sm")
                        self.spacy_available = True
                        self.logger.info("SpaCy English model loaded (Spanish not available)")
                    except OSError:
                        self.spacy_available = False
                        self.logger.warning("No SpaCy models available")
            else:
                self.spacy_available = False
            
            if NLTK_AVAILABLE:
                # Download required NLTK data
                try:
                    nltk.data.find('tokenizers/punkt')
                    nltk.data.find('corpora/stopwords')
                    self.nltk_available = True
                    self.logger.info("NLTK resources available")
                except LookupError:
                    self.logger.warning("NLTK resources not found, downloading...")
                    try:
                        nltk.download('punkt', quiet=True)
                        nltk.download('stopwords', quiet=True)
                        self.nltk_available = True
                    except:
                        self.nltk_available = False
            else:
                self.nltk_available = False
                
        except Exception as e:
            self.logger.error("NLP initialization failed", error=str(e))
            self.spacy_available = False
            self.nltk_available = False
    
    def classify_referral(self, text: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Classify if text represents a medical referral
        
        Args:
            text: Text content to classify
            
        Returns:
            Tuple of (is_referral, referral_type, priority_level)
        """
        try:
            self.logger.debug("Classifying medical referral")
            
            text_lower = text.lower()
            
            # Check for referral keywords
            referral_score = self._calculate_referral_score(text_lower)
            is_referral = referral_score > 0.3  # Threshold for classification
            
            if not is_referral:
                return False, None, None
            
            # Determine referral type
            referral_type = self._classify_referral_type(text_lower)
            
            # Determine priority level
            priority_level = self._classify_priority(text_lower)
            
            self.logger.info("Referral classification completed", 
                           is_referral=is_referral, 
                           referral_type=referral_type, 
                           priority=priority_level,
                           score=referral_score)
            
            return is_referral, referral_type, priority_level
            
        except Exception as e:
            self.logger.error("Referral classification failed", error=str(e))
            return False, None, None
    
    def _calculate_referral_score(self, text: str) -> float:
        """Calculate referral probability score"""
        score = 0.0
        total_words = len(text.split())
        
        if total_words == 0:
            return 0.0
        
        # Check for referral keywords
        referral_matches = 0
        for keyword in self.referral_keywords:
            if keyword in text:
                referral_matches += text.count(keyword)
        
        # Check for medical specialties
        specialty_matches = 0
        for specialty in self.medical_specialties:
            if specialty in text:
                specialty_matches += 1
        
        # Check for medical patterns
        pattern_matches = 0
        for pattern_list in MEDICAL_PATTERNS.values():
            for pattern in pattern_list:
                if re.search(pattern, text, re.IGNORECASE):
                    pattern_matches += 1
                    break
        
        # Calculate weighted score
        score += (referral_matches / total_words) * 10  # Weight: 10
        score += (specialty_matches / len(self.medical_specialties)) * 5  # Weight: 5
        score += (pattern_matches / len(MEDICAL_PATTERNS)) * 3  # Weight: 3
        
        # Bonus for specific medical terms
        medical_terms = [
            'paciente', 'diagnostico', 'tratamiento', 'sintomas',
            'examen', 'historia clinica', 'epicrisis', 'laboratorio'
        ]
        
        medical_term_matches = sum(1 for term in medical_terms if term in text)
        score += (medical_term_matches / len(medical_terms)) * 2  # Weight: 2
        
        return min(1.0, score)  # Cap at 1.0
    
    def _classify_referral_type(self, text: str) -> str:
        """Classify the type of medical referral"""
        type_indicators = {
            'urgente': [
                'urgente', 'emergencia', 'critico', 'inmediato',
                'stat', 'codigo', 'trauma'
            ],
            'interconsulta': [
                'interconsulta', 'consulta', 'valoracion',
                'evaluacion', 'concepto', 'opinion'
            ],
            'traslado': [
                'traslado', 'remision', 'transferencia',
                'envio', 'derivacion'
            ],
            'programado': [
                'programado', 'electivo', 'cita', 'control',
                'seguimiento', 'revision'
            ]
        }
        
        type_scores = {}
        for ref_type, indicators in type_indicators.items():
            score = sum(1 for indicator in indicators if indicator in text)
            if score > 0:
                type_scores[ref_type] = score
        
        if type_scores:
            return max(type_scores, key=type_scores.get)
        else:
            return 'interconsulta'  # Default type
    
    def _classify_priority(self, text: str) -> str:
        """Classify priority level of referral"""
        priority_scores = {}
        
        for priority, keywords in self.urgency_indicators.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > 0:
                priority_scores[priority] = score
        
        if priority_scores:
            return max(priority_scores, key=priority_scores.get)
        else:
            return 'media'  # Default priority
    
    def classify_document_type(self, text: str, filename: str = "") -> str:
        """
        Classify the type of medical document
        
        Args:
            text: Document text content
            filename: Original filename (optional)
            
        Returns:
            Document type classification
        """
        try:
            self.logger.debug("Classifying document type", filename=filename)
            
            text_lower = text.lower()
            filename_lower = filename.lower()
            
            # Combine text and filename for analysis
            combined_text = f"{text_lower} {filename_lower}"
            
            type_scores = {}
            
            # Score each document type
            for doc_type, keywords in self.document_types.items():
                score = 0
                for keyword in keywords:
                    # Higher weight for filename matches
                    if keyword in filename_lower:
                        score += 3
                    if keyword in text_lower:
                        score += 1
                
                if score > 0:
                    type_scores[doc_type] = score
            
            # Return the highest scoring type
            if type_scores:
                classified_type = max(type_scores, key=type_scores.get)
                self.logger.debug("Document classified", 
                                type=classified_type, 
                                score=type_scores[classified_type])
                return classified_type
            else:
                return 'documento_general'
                
        except Exception as e:
            self.logger.error("Document classification failed", error=str(e))
            return 'documento_general'
    
    def extract_medical_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract medical entities from text using NLP
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary of extracted entities by category
        """
        entities = {
            'persons': [],
            'organizations': [],
            'dates': [],
            'medical_terms': [],
            'medications': [],
            'procedures': []
        }
        
        try:
            if self.spacy_available:
                doc = self.nlp(text)
                
                # Extract named entities
                for ent in doc.ents:
                    if ent.label_ in ['PERSON', 'PER']:
                        entities['persons'].append(ent.text)
                    elif ent.label_ in ['ORG', 'ORGANIZATION']:
                        entities['organizations'].append(ent.text)
                    elif ent.label_ in ['DATE', 'TIME']:
                        entities['dates'].append(ent.text)
            
            # Extract medical terms using patterns
            medical_patterns = {
                'medications': [
                    r'\b(?:mg|ml|gr|cc|ui|mcg)\b',  # Dosage units
                    r'\b\w+(?:cilina|micina|zole|pril|sartan)\b'  # Common drug endings
                ],
                'procedures': [
                    r'\b(?:cirugia|operacion|biopsia|endoscopia|cateterismo)\b',
                    r'\b(?:rx|radiografia|tomografia|resonancia|ecografia)\b'
                ]
            }
            
            for category, patterns in medical_patterns.items():
                for pattern in patterns:
                    matches = re.findall(pattern, text, re.IGNORECASE)
                    entities[category].extend(matches)
            
            # Remove duplicates
            for category in entities:
                entities[category] = list(set(entities[category]))
            
        except Exception as e:
            self.logger.error("Entity extraction failed", error=str(e))
        
        return entities
    
    def classify_urgency_level(self, text: str) -> Tuple[str, float]:
        """
        Classify urgency level with confidence score
        
        Args:
            text: Text to analyze
            
        Returns:
            Tuple of (urgency_level, confidence_score)
        """
        try:
            text_lower = text.lower()
            urgency_scores = {}
            
            for level, indicators in self.urgency_indicators.items():
                score = 0
                for indicator in indicators:
                    # Count occurrences with position weighting
                    matches = list(re.finditer(re.escape(indicator), text_lower))
                    for match in matches:
                        # Higher weight for matches at the beginning
                        position_weight = 1.0 - (match.start() / len(text_lower)) * 0.5
                        score += position_weight
                
                if score > 0:
                    urgency_scores[level] = score
            
            if urgency_scores:
                max_level = max(urgency_scores, key=urgency_scores.get)
                max_score = urgency_scores[max_level]
                
                # Calculate confidence based on score and presence of multiple indicators
                total_score = sum(urgency_scores.values())
                confidence = min(1.0, max_score / total_score)
                
                return max_level, confidence
            else:
                return 'media', 0.5  # Default with medium confidence
                
        except Exception as e:
            self.logger.error("Urgency classification failed", error=str(e))
            return 'media', 0.0
    
    def extract_specialty_requests(self, text: str) -> List[str]:
        """Extract requested medical specialties from text"""
        try:
            text_lower = text.lower()
            found_specialties = []
            
            for specialty in self.medical_specialties:
                if specialty in text_lower:
                    found_specialties.append(specialty)
            
            # Look for specialty patterns
            specialty_patterns = [
                r'(?:especialidad|servicio|departamento)[\s:]*([^.\n]+)',
                r'(?:interconsulta)[\s:]*([^.\n]+)',
                r'(?:valoracion por)[\s:]*([^.\n]+)'
            ]
            
            for pattern in specialty_patterns:
                matches = re.findall(pattern, text_lower)
                for match in matches:
                    # Check if match contains known specialty
                    for specialty in self.medical_specialties:
                        if specialty in match:
                            found_specialties.append(specialty)
            
            return list(set(found_specialties))  # Remove duplicates
            
        except Exception as e:
            self.logger.error("Specialty extraction failed", error=str(e))
            return []
    
    def validate_medical_content(self, text: str) -> Dict[str, Any]:
        """
        Validate if content contains valid medical information
        
        Returns:
            Dictionary with validation results
        """
        validation = {
            'is_medical': False,
            'confidence': 0.0,
            'indicators': [],
            'missing_elements': [],
            'quality_score': 0.0
        }
        
        try:
            text_lower = text.lower()
            
            # Check for medical indicators
            medical_indicators = [
                'paciente', 'diagnostico', 'sintomas', 'tratamiento',
                'examen', 'laboratorio', 'medicamento', 'cirugia',
                'historia clinica', 'antecedentes', 'evolucion'
            ]
            
            found_indicators = [ind for ind in medical_indicators if ind in text_lower]
            validation['indicators'] = found_indicators
            
            # Calculate medical content score
            medical_score = len(found_indicators) / len(medical_indicators)
            validation['confidence'] = medical_score
            validation['is_medical'] = medical_score > 0.2
            
            # Check for essential medical elements
            essential_elements = {
                'patient_id': any(pattern in text_lower for pattern in ['cedula', 'documento', 'id']),
                'patient_name': any(pattern in text_lower for pattern in ['paciente', 'nombre']),
                'diagnosis': any(pattern in text_lower for pattern in ['diagnostico', 'dx']),
                'date': bool(re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}', text))
            }
            
            missing_elements = [elem for elem, present in essential_elements.items() if not present]
            validation['missing_elements'] = missing_elements
            
            # Calculate quality score
            completeness = 1.0 - (len(missing_elements) / len(essential_elements))
            validation['quality_score'] = (medical_score + completeness) / 2
            
        except Exception as e:
            self.logger.error("Medical content validation failed", error=str(e))
        
        return validation
