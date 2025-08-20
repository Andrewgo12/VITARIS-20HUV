"""
Gmail API Client for VITAL RED Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import os
import pickle
import base64
import email
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import structlog

from config import GMAIL_CONFIG, EMAIL_CONFIG, LOGGING_CONFIG

# Configure structured logging
logger = structlog.get_logger(__name__)

class GmailClient:
    """
    Gmail API client for fetching and processing medical referral emails
    """
    
    def __init__(self):
        self.service = None
        self.credentials = None
        self.scopes = GMAIL_CONFIG["SCOPES"]
        self.credentials_file = GMAIL_CONFIG["CREDENTIALS_FILE"]
        self.token_file = GMAIL_CONFIG["TOKEN_FILE"]
        self.application_name = GMAIL_CONFIG["APPLICATION_NAME"]
        
        # Initialize logging
        self.logger = logger.bind(component="gmail_client")
        
    def authenticate(self) -> bool:
        """
        Authenticate with Gmail API using OAuth2
        Returns True if authentication successful, False otherwise
        """
        try:
            self.logger.info("Starting Gmail API authentication")
            
            # Load existing credentials
            if self.token_file.exists():
                with open(self.token_file, 'rb') as token:
                    self.credentials = pickle.load(token)
            
            # If there are no valid credentials, request authorization
            if not self.credentials or not self.credentials.valid:
                if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                    self.logger.info("Refreshing expired credentials")
                    self.credentials.refresh(Request())
                else:
                    self.logger.info("Requesting new authorization")
                    if not self.credentials_file.exists():
                        self.logger.error(f"Credentials file not found: {self.credentials_file}")
                        return False
                    
                    flow = InstalledAppFlow.from_client_secrets_file(
                        str(self.credentials_file), self.scopes
                    )
                    self.credentials = flow.run_local_server(port=0)
                
                # Save credentials for next run
                with open(self.token_file, 'wb') as token:
                    pickle.dump(self.credentials, token)
            
            # Build the Gmail service
            self.service = build('gmail', 'v1', credentials=self.credentials)
            self.logger.info("Gmail API authentication successful")
            return True
            
        except Exception as e:
            self.logger.error("Gmail API authentication failed", error=str(e))
            return False
    
    def get_messages(self, query: str = "", max_results: int = None) -> List[Dict[str, Any]]:
        """
        Fetch messages from Gmail based on query
        
        Args:
            query: Gmail search query (e.g., "is:unread subject:referencia")
            max_results: Maximum number of messages to fetch
            
        Returns:
            List of message dictionaries
        """
        try:
            if not self.service:
                raise Exception("Gmail service not initialized. Call authenticate() first.")
            
            max_results = max_results or GMAIL_CONFIG["MAX_RESULTS"]
            
            self.logger.info("Fetching Gmail messages", query=query, max_results=max_results)
            
            # Search for messages
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            self.logger.info(f"Found {len(messages)} messages")
            
            return messages
            
        except HttpError as e:
            self.logger.error("HTTP error fetching messages", error=str(e))
            return []
        except Exception as e:
            self.logger.error("Error fetching messages", error=str(e))
            return []
    
    def get_message_details(self, message_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information for a specific message
        
        Args:
            message_id: Gmail message ID
            
        Returns:
            Message details dictionary or None if error
        """
        try:
            if not self.service:
                raise Exception("Gmail service not initialized")
            
            self.logger.debug("Fetching message details", message_id=message_id)
            
            message = self.service.users().messages().get(
                userId='me',
                id=message_id,
                format='full'
            ).execute()
            
            return message
            
        except HttpError as e:
            self.logger.error("HTTP error fetching message details", 
                            message_id=message_id, error=str(e))
            return None
        except Exception as e:
            self.logger.error("Error fetching message details", 
                            message_id=message_id, error=str(e))
            return None
    
    def get_attachment(self, message_id: str, attachment_id: str) -> Optional[bytes]:
        """
        Download an email attachment
        
        Args:
            message_id: Gmail message ID
            attachment_id: Gmail attachment ID
            
        Returns:
            Attachment data as bytes or None if error
        """
        try:
            if not self.service:
                raise Exception("Gmail service not initialized")
            
            self.logger.debug("Downloading attachment", 
                            message_id=message_id, attachment_id=attachment_id)
            
            attachment = self.service.users().messages().attachments().get(
                userId='me',
                messageId=message_id,
                id=attachment_id
            ).execute()
            
            data = attachment['data']
            file_data = base64.urlsafe_b64decode(data.encode('UTF-8'))
            
            self.logger.debug("Attachment downloaded successfully", 
                            size=len(file_data))
            
            return file_data
            
        except HttpError as e:
            self.logger.error("HTTP error downloading attachment", 
                            message_id=message_id, attachment_id=attachment_id, error=str(e))
            return None
        except Exception as e:
            self.logger.error("Error downloading attachment", 
                            message_id=message_id, attachment_id=attachment_id, error=str(e))
            return None
    
    def parse_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse Gmail message into structured format
        
        Args:
            message: Raw Gmail message from API
            
        Returns:
            Parsed message dictionary
        """
        try:
            payload = message.get('payload', {})
            headers = payload.get('headers', [])
            
            # Extract headers
            header_dict = {}
            for header in headers:
                header_dict[header['name'].lower()] = header['value']
            
            # Parse date
            date_str = header_dict.get('date', '')
            try:
                date_received = email.utils.parsedate_to_datetime(date_str)
            except:
                date_received = datetime.now()
            
            # Extract body
            body_text, body_html = self._extract_body(payload)
            
            # Extract attachments info
            attachments = self._extract_attachment_info(payload)
            
            parsed_message = {
                'gmail_id': message['id'],
                'thread_id': message['threadId'],
                'subject': header_dict.get('subject', ''),
                'sender_email': self._extract_email(header_dict.get('from', '')),
                'sender_name': self._extract_name(header_dict.get('from', '')),
                'recipient_email': self._extract_email(header_dict.get('to', '')),
                'date_received': date_received,
                'body_text': body_text,
                'body_html': body_html,
                'snippet': message.get('snippet', ''),
                'attachments': attachments,
                'labels': message.get('labelIds', []),
                'size_estimate': message.get('sizeEstimate', 0)
            }
            
            return parsed_message
            
        except Exception as e:
            self.logger.error("Error parsing message", 
                            message_id=message.get('id', 'unknown'), error=str(e))
            return {}
    
    def _extract_body(self, payload: Dict[str, Any]) -> Tuple[str, str]:
        """Extract text and HTML body from message payload"""
        body_text = ""
        body_html = ""
        
        def extract_from_part(part):
            nonlocal body_text, body_html
            
            mime_type = part.get('mimeType', '')
            body = part.get('body', {})
            data = body.get('data', '')
            
            if data:
                decoded_data = base64.urlsafe_b64decode(data.encode('UTF-8')).decode('utf-8', errors='ignore')
                
                if mime_type == 'text/plain':
                    body_text += decoded_data
                elif mime_type == 'text/html':
                    body_html += decoded_data
            
            # Recursively process parts
            for subpart in part.get('parts', []):
                extract_from_part(subpart)
        
        extract_from_part(payload)
        return body_text.strip(), body_html.strip()
    
    def _extract_attachment_info(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract attachment information from message payload"""
        attachments = []
        
        def extract_from_part(part):
            body = part.get('body', {})
            filename = part.get('filename', '')
            
            if filename and body.get('attachmentId'):
                attachment_info = {
                    'filename': filename,
                    'mime_type': part.get('mimeType', ''),
                    'attachment_id': body['attachmentId'],
                    'size': body.get('size', 0)
                }
                attachments.append(attachment_info)
            
            # Recursively process parts
            for subpart in part.get('parts', []):
                extract_from_part(subpart)
        
        extract_from_part(payload)
        return attachments
    
    def _extract_email(self, from_header: str) -> str:
        """Extract email address from From header"""
        try:
            if '<' in from_header and '>' in from_header:
                return from_header.split('<')[1].split('>')[0].strip()
            else:
                return from_header.strip()
        except:
            return from_header
    
    def _extract_name(self, from_header: str) -> str:
        """Extract sender name from From header"""
        try:
            if '<' in from_header:
                return from_header.split('<')[0].strip().strip('"')
            else:
                return ""
        except:
            return ""
    
    def mark_as_read(self, message_id: str) -> bool:
        """Mark a message as read"""
        try:
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
            return True
        except Exception as e:
            self.logger.error("Error marking message as read", 
                            message_id=message_id, error=str(e))
            return False
    
    def add_label(self, message_id: str, label_name: str) -> bool:
        """Add a label to a message"""
        try:
            # First, get or create the label
            labels = self.service.users().labels().list(userId='me').execute()
            label_id = None
            
            for label in labels.get('labels', []):
                if label['name'] == label_name:
                    label_id = label['id']
                    break
            
            if not label_id:
                # Create the label
                label_object = {
                    'name': label_name,
                    'labelListVisibility': 'labelShow',
                    'messageListVisibility': 'show'
                }
                created_label = self.service.users().labels().create(
                    userId='me', body=label_object
                ).execute()
                label_id = created_label['id']
            
            # Add the label to the message
            self.service.users().messages().modify(
                userId='me',
                id=message_id,
                body={'addLabelIds': [label_id]}
            ).execute()
            
            return True
            
        except Exception as e:
            self.logger.error("Error adding label to message", 
                            message_id=message_id, label=label_name, error=str(e))
            return False
    
    def build_referral_query(self) -> str:
        """Build Gmail query to find medical referral emails"""
        keywords = EMAIL_CONFIG["REFERRAL_KEYWORDS"]
        query_parts = []
        
        # Add keyword search
        keyword_query = " OR ".join([f'subject:"{keyword}"' for keyword in keywords])
        query_parts.append(f"({keyword_query})")
        
        # Add body search for keywords
        body_keyword_query = " OR ".join([f'"{keyword}"' for keyword in keywords])
        query_parts.append(f"({body_keyword_query})")
        
        # Combine with OR
        final_query = " OR ".join(query_parts)
        
        # Add additional filters
        final_query += " has:attachment"  # Only emails with attachments
        final_query += " -in:spam -in:trash"  # Exclude spam and trash
        
        return final_query
