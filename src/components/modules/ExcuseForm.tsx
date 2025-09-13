"use client";

import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';

interface ExcuseFormProps {
  isRtl: boolean;
  homeT: {[key: string]: string};
  onBack: () => void;
}

interface ExcuseFormData {
  arbitre_nom: string;
  arbitre_prenom: string;
  date_debut: string;
  date_fin: string;
  cause: string;
  piece_jointe: File | null;
}

export default function ExcuseForm({ isRtl, homeT, onBack }: ExcuseFormProps) {
  const { profile } = useProfile();
  const [formData, setFormData] = useState<ExcuseFormData>({
    arbitre_nom: '',
    arbitre_prenom: '',
    date_debut: '',
    date_fin: '',
    cause: '',
    piece_jointe: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [usedDates, setUsedDates] = useState<{start: string, end: string}[]>([]);

  // Remplir automatiquement les champs nom et prénom
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        arbitre_nom: profile.last_name || '',
        arbitre_prenom: profile.first_name || ''
      }));
    }
  }, [profile]);

  // Charger les dates déjà utilisées
  useEffect(() => {
    const fetchUsedDates = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return;

        // Utiliser l'URL backend directe
        const backendUrl =
          process.env.NODE_ENV === "production"
            ? "https://federation-backend.onrender.com"
            : "http://localhost:8000";

        const response = await fetch(
          `${backendUrl}/api/accounts/arbitres/excuses/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.excuses) {
            const dates = data.excuses.map((excuse: any) => ({
              start: excuse.date_debut,
              end: excuse.date_fin,
            }));
            setUsedDates(dates);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des dates utilisées:', error);
      }
    };

    fetchUsedDates();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Effacer l'erreur du fichier
    if (errors.piece_jointe) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.piece_jointe;
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      piece_jointe: file
    }));
  };

  // Fonction pour vérifier si une date est déjà utilisée
  const isDateUsed = (date: string) => {
    return usedDates.some(usedDate => {
      const start = new Date(usedDate.start);
      const end = new Date(usedDate.end);
      const checkDate = new Date(date);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Fonction pour obtenir la date minimale (aujourd'hui)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setErrors({});
    
    // Validation des champs obligatoires
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est obligatoire';
    } else if (new Date(formData.date_debut) < new Date(getMinDate())) {
      newErrors.date_debut = 'La date de début ne peut pas être dans le passé';
    } else if (isDateUsed(formData.date_debut)) {
      newErrors.date_debut = 'Cette date est déjà utilisée dans une autre excuse';
    }
    
    if (!formData.date_fin) {
      newErrors.date_fin = 'La date de fin est obligatoire';
    } else if (new Date(formData.date_fin) < new Date(getMinDate())) {
      newErrors.date_fin = 'La date de fin ne peut pas être dans le passé';
    } else if (isDateUsed(formData.date_fin)) {
      newErrors.date_fin = 'Cette date est déjà utilisée dans une autre excuse';
    }
    
    if (!formData.cause.trim()) {
      newErrors.cause = 'La cause de l\'excuse est obligatoire';
    }
    
    // Vérifier que la date de fin est après la date de début
    if (formData.date_debut && formData.date_fin && new Date(formData.date_fin) <= new Date(formData.date_debut)) {
      newErrors.date_fin = 'La date de fin doit être postérieure à la date de début';
    }
    
    // Vérifier la taille du fichier
    if (formData.piece_jointe && formData.piece_jointe.size > 5 * 1024 * 1024) {
      newErrors.piece_jointe = 'La taille du fichier ne doit pas dépasser 5MB';
    }
    
    // Vérifier le type de fichier
    if (formData.piece_jointe) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(formData.piece_jointe.type)) {
        newErrors.piece_jointe = 'Format de fichier non supporté. Utilisez JPG, PNG ou PDF';
      }
    }
    
    // Si il y a des erreurs, les afficher et arrêter
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        alert("Token d'authentification non trouvé");
        return;
      }

      // Créer FormData pour supporter les fichiers
      const formDataToSend = new FormData();
      formDataToSend.append("arbitre_nom", formData.arbitre_nom);
      formDataToSend.append("arbitre_prenom", formData.arbitre_prenom);
      formDataToSend.append("date_debut", formData.date_debut);
      formDataToSend.append("date_fin", formData.date_fin);
      formDataToSend.append("cause", formData.cause);

      if (formData.piece_jointe) {
        formDataToSend.append("piece_jointe", formData.piece_jointe);
      }

      // Utiliser l'URL backend directe
      const backendUrl =
        process.env.NODE_ENV === "production"
          ? "https://federation-backend.onrender.com"
          : "http://localhost:8000";

      const response = await fetch(
        `${backendUrl}/api/accounts/arbitres/excuses/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Ne pas définir Content-Type pour FormData
          },
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Excuse ajoutée avec succès !");
        onBack();
      } else {
        // Gérer les erreurs du serveur
        if (result.error) {
          if (typeof result.error === "string") {
            setErrors({ general: result.error });
          } else if (typeof result.error === "object") {
            setErrors(result.error);
          }
        } else {
          setErrors({ general: "Erreur lors de l'ajout de l'excuse" });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'excuse:', error);
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors text-sm ${isRtl ? 'font-arabic' : ''}`}
        >
          <span className="text-xs">{isRtl ? '→' : '←'}</span>
          {homeT.back || 'Retour'}
        </button>
        
        <h1 className={`text-xl font-bold text-white drop-shadow-lg ${isRtl ? 'font-arabic' : ''}`}>
          Ajouter une excuse
        </h1>
        
        <div className="w-16"></div>
      </div>

             {/* Formulaire */}
       <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
         <div className="p-6">
           {/* Affichage des erreurs générales */}
           {errors.general && (
             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
               <div className="flex items-center">
                 <span className="text-red-600 text-lg mr-2">⚠️</span>
                 <p className="text-red-800 font-medium">{errors.general}</p>
               </div>
             </div>
           )}
           
           <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Informations de l'arbitre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'arbitre
                </label>
                <input
                  type="text"
                  name="arbitre_nom"
                  value={formData.arbitre_nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom de l'arbitre
                </label>
                <input
                  type="text"
                  name="arbitre_prenom"
                  value={formData.arbitre_prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Période d'excuse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Date de début <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="date"
                   name="date_debut"
                   value={formData.date_debut}
                   onChange={handleInputChange}
                   min={getMinDate()}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                     errors.date_debut ? 'border-red-500 bg-red-50' : 'border-gray-300'
                   }`}
                   required
                 />
                 {errors.date_debut && (
                   <p className="mt-1 text-sm text-red-600 flex items-center">
                     <span className="mr-1">⚠️</span>
                     {errors.date_debut}
                   </p>
                 )}
               </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Date de fin <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="date"
                   name="date_fin"
                   value={formData.date_fin}
                   onChange={handleInputChange}
                   min={formData.date_debut || getMinDate()}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                     errors.date_fin ? 'border-red-500 bg-red-50' : 'border-gray-300'
                   }`}
                   required
                 />
                 {errors.date_fin && (
                   <p className="mt-1 text-sm text-red-600 flex items-center">
                     <span className="mr-1">⚠️</span>
                     {errors.date_fin}
                   </p>
                 )}
               </div>
            </div>

                         {/* Cause de l'excuse */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Cause de l'excuse <span className="text-red-500">*</span>
               </label>
               <textarea
                 name="cause"
                 value={formData.cause}
                 onChange={handleInputChange}
                 rows={4}
                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                   errors.cause ? 'border-red-500 bg-red-50' : 'border-gray-300'
                 }`}
                 placeholder="Décrivez la raison de votre excuse..."
                 required
               />
               {errors.cause && (
                 <p className="mt-1 text-sm text-red-600 flex items-center">
                   <span className="mr-1">⚠️</span>
                   {errors.cause}
                 </p>
               )}
             </div>

             {/* Pièce jointe */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Pièce jointe (optionnel)
               </label>
               <div className="space-y-2">
                 <input
                   type="file"
                   accept="image/*,.pdf"
                   onChange={handleFileChange}
                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                     errors.piece_jointe ? 'border-red-500 bg-red-50' : 'border-gray-300'
                   }`}
                 />
                 {formData.piece_jointe && (
                   <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                     <span className="font-medium">Fichier sélectionné :</span> {formData.piece_jointe.name}
                     <span className="ml-2 text-gray-500">
                       ({(formData.piece_jointe.size / 1024 / 1024).toFixed(2)} MB)
                     </span>
                   </div>
                 )}
                 {errors.piece_jointe && (
                   <p className="mt-1 text-sm text-red-600 flex items-center">
                     <span className="mr-1">⚠️</span>
                     {errors.piece_jointe}
                   </p>
                 )}
                 <p className="text-xs text-gray-500">
                   Formats acceptés : JPG, PNG, PDF (max 5MB)
                 </p>
               </div>
             </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'excuse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
