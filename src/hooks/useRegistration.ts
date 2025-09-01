import { useState, useCallback } from 'react';

// Types pour les données d'inscription
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  profilePhoto?: File;
}

export interface ProfessionalInfo {
  ligueCode: string; // Code de la ligue d'arbitrage
  grade: string;
  dateNaissance: string; // Date de naissance au format YYYY-MM-DD
  lieuNaissance: string; // Lieu de naissance
}

export interface SecurityInfo {
  password: string;
  confirmPassword: string;
}

export interface RegistrationData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  securityInfo: SecurityInfo;
}

// Options pour les listes déroulantes
export const LEAGUES = [
  { value: 'ligue1', label: 'Ligue 1 Professionnelle' },
  { value: 'ligue2', label: 'Ligue 2 Professionnelle' },
  { value: 'amateur', label: 'Ligue Nationale Amateur' },
  { value: 'regional', label: 'Ligue Régionale' }
];

export const GRADES = [
  { value: 'candidat', label: 'Candidat' },
  { value: '3eme_serie', label: '3ème Série' },
  { value: '2eme_serie', label: '2ème Série' },
  { value: '1ere_serie', label: '1ère Série' },
  { value: 'federale', label: 'Fédérale' }
];

// Données initiales
const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  address: '',
  profilePhoto: undefined
};

const initialProfessionalInfo: ProfessionalInfo = {
  ligueCode: '',
  grade: '',
  dateNaissance: '',
  lieuNaissance: ''
};

const initialSecurityInfo: SecurityInfo = {
  password: '',
  confirmPassword: ''
};

export const useRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    personalInfo: initialPersonalInfo,
    professionalInfo: initialProfessionalInfo,
    securityInfo: initialSecurityInfo
  });

  // Mettre à jour les informations personnelles
  const updatePersonalInfo = useCallback((data: Partial<PersonalInfo>) => {
    setRegistrationData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data }
    }));
    // Effacer les erreurs liées aux champs modifiés
    const fieldsToClean = Object.keys(data);
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToClean.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  }, []);

  // Mettre à jour les informations professionnelles
  const updateProfessionalInfo = useCallback((data: Partial<ProfessionalInfo>) => {
    setRegistrationData(prev => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, ...data }
    }));
    // Effacer les erreurs
    const fieldsToClean = Object.keys(data);
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToClean.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  }, []);

  // Mettre à jour les informations de sécurité
  const updateSecurityInfo = useCallback((data: Partial<SecurityInfo>) => {
    setRegistrationData(prev => ({
      ...prev,
      securityInfo: { ...prev.securityInfo, ...data }
    }));
    // Effacer les erreurs
    const fieldsToClean = Object.keys(data);
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToClean.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  }, []);

  // Validation des étapes
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1: // Informations personnelles
        const { firstName, lastName, phoneNumber, email, address } = registrationData.personalInfo;
        
        if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!phoneNumber.trim()) {
          newErrors.phoneNumber = 'Le numéro de téléphone est requis';
        } else if (!/^\+216\d{8}$/.test(phoneNumber)) {
          newErrors.phoneNumber = 'Format: +216XXXXXXXX';
        }
        if (!email.trim()) {
          newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors.email = 'Format d\'email invalide';
        }
        if (!address.trim()) newErrors.address = 'L\'adresse est requise';
        break;

      case 2: // Informations professionnelles
        const { ligueCode, grade, dateNaissance, lieuNaissance } = registrationData.professionalInfo;
        
        if (!ligueCode) newErrors.ligueCode = 'Veuillez sélectionner une ligue';
        if (!grade) newErrors.grade = 'Veuillez sélectionner un grade';
        if (!dateNaissance.trim()) {
          newErrors.dateNaissance = 'La date de naissance est requise';
        } else {
          // Vérifier le format de date et l'âge minimum
          const birthDate = new Date(dateNaissance);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (isNaN(birthDate.getTime())) {
            newErrors.dateNaissance = 'Format de date invalide';
          } else if (age > 65) {
            newErrors.dateNaissance = 'L\'âge maximum est de 65 ans';
          }
        }
        if (!lieuNaissance.trim()) {
          newErrors.lieuNaissance = 'Le lieu de naissance est requis';
        }
        break;

      case 3: // Informations de sécurité
        const { password, confirmPassword } = registrationData.securityInfo;
        
        if (!password) {
          newErrors.password = 'Le mot de passe est requis';
        } else if (password.length < 8) {
          newErrors.password = 'Minimum 8 caractères';
        }
        if (!confirmPassword) {
          newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
        } else if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [registrationData]);

  // Navigation entre les étapes
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  }, []);

  // Soumission finale
  const submitRegistration = useCallback(async () => {
    if (!validateStep(3)) return false;

    setIsLoading(true);
    try {
      // Préparer les données pour l'API Django
      
      // Créer FormData pour gérer l'image de profil
      const formData = new FormData();
      
      // Ajouter les champs texte
      formData.append('phone_number', registrationData.personalInfo.phoneNumber);
      formData.append('first_name', registrationData.personalInfo.firstName);
      formData.append('last_name', registrationData.personalInfo.lastName);
      formData.append('email', registrationData.personalInfo.email);
      formData.append('address', registrationData.personalInfo.address);
      formData.append('ligue_id', '2'); // ID de la ligue (2 pour Ligue de Tunis, 22 pour Ligue 1, etc.)
      formData.append('grade', registrationData.professionalInfo.grade);
      formData.append('birth_date', registrationData.professionalInfo.dateNaissance);
      formData.append('birth_place', registrationData.professionalInfo.lieuNaissance);
      formData.append('password', registrationData.securityInfo.password);
      formData.append('password_confirm', registrationData.securityInfo.confirmPassword);
      
      // Ajouter l'image de profil si elle existe
      if (registrationData.personalInfo.profilePhoto && registrationData.personalInfo.profilePhoto instanceof File) {
        formData.append('profile_photo', registrationData.personalInfo.profilePhoto);
      }

      // Configuration de l'URL de base
      const getBaseURL = () => {
        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return 'http://192.168.1.101:8000/api';
          }
        }
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      };

      // Appel à l'API Django avec FormData
      const response = await fetch(`${getBaseURL()}/accounts/arbitres/register/`, {
        method: 'POST',
        // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de l\'inscription';
        let fieldErrors: Record<string, string> = {};
        
        try {
          const errorData = await response.json();
          
          // Gérer les erreurs de validation des champs
          if (errorData.errors && typeof errorData.errors === 'object') {
            fieldErrors = errorData.errors;
            // Prendre la première erreur comme message principal
            const firstError = Object.values(errorData.errors)[0];
            errorMessage = typeof firstError === 'string' ? firstError : 'Erreur de validation des données';
          } else {
            errorMessage = errorData.message || errorData.detail || 'Erreur du serveur';
          }
        } catch {
          if (response.status === 404) {
            errorMessage = 'Service d\'inscription non trouvé. Vérifiez que le backend est démarré.';
          } else if (response.status >= 500) {
            errorMessage = 'Erreur serveur. Vérifiez la configuration du backend.';
          } else {
            errorMessage = `Erreur ${response.status}: ${response.statusText}`;
          }
        }
        
        // Créer une erreur avec les détails des champs
        const error = new Error(errorMessage);
        (error as any).fieldErrors = fieldErrors;
        throw error;
      }

      const result = await response.json();
      console.log('Inscription réussie:', result);
      
      return true;
    } catch (error: unknown) {
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion spécifique des erreurs de connexion
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors({ 
          submit: 'Impossible de se connecter au serveur. Vérifiez que le backend Django est démarré sur le port 8000.'
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription. Veuillez réessayer.';
        
        // Gérer les erreurs spécifiques aux champs
        const fieldErrors = (error as any).fieldErrors || {};
        if (Object.keys(fieldErrors).length > 0) {
          // Mettre à jour les erreurs des champs spécifiques
          setErrors(prev => ({
            ...prev,
            ...fieldErrors,
            submit: errorMessage
          }));
        } else {
          setErrors({ 
            submit: errorMessage
          });
        }
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [registrationData, validateStep]);

  // Reset du formulaire
  const resetRegistration = useCallback(() => {
    setRegistrationData({
      personalInfo: initialPersonalInfo,
      professionalInfo: initialProfessionalInfo,
      securityInfo: initialSecurityInfo
    });
    setCurrentStep(1);
    setErrors({});
    setIsLoading(false);
  }, []);

  return {
    // État
    currentStep,
    registrationData,
    errors,
    isLoading,
    
    // Actions de mise à jour
    updatePersonalInfo,
    updateProfessionalInfo,
    updateSecurityInfo,
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    
    // Validation et soumission
    validateStep,
    submitRegistration,
    resetRegistration,
    
    // Helpers
    isStepValid: (step: number) => validateStep(step),
    canProceed: () => validateStep(currentStep)
  };
};
