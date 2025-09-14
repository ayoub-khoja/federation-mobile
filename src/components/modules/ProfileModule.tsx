"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import OptimizedImage from "../OptimizedImage";
import { useProfile } from "../../hooks/useProfile";
import { useLigues } from "../../hooks/useLigues";
import { GRADES } from "../../hooks/useRegistration";

import { getBackendUrl } from "../../config/config";

interface ProfileModuleProps {
  isRtl: boolean;
  homeT: { [key: string]: string };
}

export default function ProfileModule({ isRtl, homeT }: ProfileModuleProps) {
  const router = useRouter();
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    logout,
    getAge,
    getFormattedJoinDate,
  } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editData, setEditData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    cin: string;
    role: string;
    grade: string;
    birth_date: string;
    birth_place: string;
    address: string;
    ligue: string;
    [key: string]: string;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    cin: "",
    role: "",
    grade: "",
    birth_date: "",
    birth_place: "",
    address: "",
    ligue: "",
  });

  // Initialiser les données d'édition quand le profil est chargé
  React.useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        cin: (profile as any).cin || "",
        role: profile.role || "",
        grade: profile.grade || "",
        birth_date: profile.birth_date || "",
        birth_place: profile.birth_place || "",
        address: profile.address || "",
        ligue: profile.ligue || "",
      });
      // Reset l'état d'erreur d'image quand le profil change
      setImageError(false);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        alert("Token d'authentification non trouvé");
        return;
      }

      const formData = new FormData();

      // Ajouter tous les champs autorisés
      const allowedFields = [
        "first_name",
        "last_name",
        "email",
        "address",
        "birth_date",
        "birth_place",
        "cin",
        "role",
        "grade",
        "ligue",
      ];

      allowedFields.forEach((field) => {
        if (editData[field] !== undefined && editData[field] !== "") {
          formData.append(field, editData[field]);
        }
      });

      const result = await updateProfileWithPhoto(formData, accessToken);

      if (result.success) {
        setIsEditing(false);
        // Recharger le profil pour afficher les nouvelles données
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  // Fonction pour mettre à jour le profil avec photo
  const updateProfileWithPhoto = async (
    formData: FormData,
    accessToken: string
  ) => {
    const response = await fetch("/api/accounts/arbitres/profile/update/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Ne pas définir Content-Type pour FormData
      },
      body: formData, // FormData avec profile_photo
    });

    return response.json();
  };

  // Fonction pour gérer le changement de photo
  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La taille du fichier ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        alert("Token d'authentification non trouvé");
        return;
      }

      const formData = new FormData();
      formData.append("profile_photo", file);

      const result = await updateProfileWithPhoto(formData, accessToken);

      if (result.success || result.profile_photo) {
        // Recharger le profil pour afficher la nouvelle photo
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour de la photo");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo:", error);
      alert("Erreur lors de la mise à jour de la photo");
    } finally {
      setIsUploading(false);
      setShowPhotoOptions(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        cin: (profile as any).cin || "",
        role: profile.role || "",
        grade: profile.grade || "",
        birth_date: profile.birth_date || "",
        birth_place: profile.birth_place || "",
        address: profile.address || "",
        ligue: profile.ligue || "",
      });
    }
    setIsEditing(false);
  };

  // Fonction pour formater le rôle
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case "arbitre":
        return "Arbitre Principal";
      case "assistant":
        return "Arbitre Assistant";
      default:
        return role || "Non défini";
    }
  };

  // Fonction pour obtenir la couleur du badge de rôle
  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "arbitre":
        return "bg-blue-100 text-blue-800";
      case "assistant":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Non connecté
          </h3>
          <p className="text-gray-600 mb-4">
            Veuillez vous connecter pour voir votre profil
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl shadow-ftf overflow-hidden animate-fadeInUp">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-3xl font-bold text-red-600 ${
              isRtl ? "font-arabic" : ""
            }`}
          >
            {homeT.myProfile}
          </h2>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Se déconnecter
          </button>
        </div>

        {/* Photo de profil et informations de base */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image de profil à gauche */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-red-200 overflow-hidden">
                  {profile.profile_photo && !imageError ? (
                    <OptimizedImage
                      src={
                        profile.profile_photo.startsWith("http")
                          ? profile.profile_photo
                          : `${getBackendUrl()}${profile.profile_photo}`
                      }
                      alt="Photo de profil"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => {
                        console.error(
                          "Erreur de chargement de l'image de profil"
                        );
                        setImageError(true);
                      }}
                      onLoad={() => {
                        console.log("Image de profil chargée avec succès");
                        setImageError(false);
                      }}
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">👤</span>
                  )}
                </div>
                <button
                  onClick={() => setShowPhotoOptions(true)}
                  className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  disabled={isUploading}
                >
                  <span className="text-sm">📷</span>
                </button>
              </div>
            </div>

            {/* Informations à côté de l'image */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {profile.full_name ||
                  `${profile.first_name} ${profile.last_name}`}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>📞</span> {profile.phone_number}
                </p>
                {profile.email && (
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <span>✉️</span> {profile.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informations détaillées sous l'image et les données */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Carte Rôle */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚽</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 text-xs">Rôle</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      profile.role
                    )}`}
                  >
                    {getRoleDisplay(profile.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Grade */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 text-xs">
                    Grade
                  </h4>
                  <p className="text-purple-700 font-medium text-xs">
                    {GRADES.find((g) => g.value === profile.grade)?.label ||
                      profile.grade}
                  </p>
                </div>
              </div>
            </div>

            {/* Carte Ligue */}
            {profile.ligue_nom && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 text-xs">
                      Ligue
                    </h4>
                    <p className="text-green-700 font-medium text-xs">
                      {profile.ligue_nom}
                    </p>
                    {profile.ligue_region && (
                      <p className="text-green-600 text-xs">
                        {profile.ligue_region}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Carte Date de naissance */}
            {profile.birth_date && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 text-xs">
                      Date de naissance
                    </h4>
                    <p className="text-orange-700 font-medium text-xs">
                      {new Date(profile.birth_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Carte Âge */}
            {getAge() && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎂</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-800 text-xs">Âge</h4>
                    <p className="text-pink-700 font-medium text-xs">
                      {getAge()} ans
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Carte Lieu de naissance */}
            {profile.birth_place && (
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏠</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-800 text-xs">
                      Lieu de naissance
                    </h4>
                    <p className="text-indigo-700 font-medium text-xs">
                      {profile.birth_place}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Carte Adresse */}
            {profile.address && (
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-800 text-xs">
                      Adresse
                    </h4>
                    <p className="text-teal-700 font-medium text-xs">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Carte Licence */}
            {profile.license_number && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🆔</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 text-sm">
                      Licence
                    </h4>
                    <p className="text-amber-700 font-medium">
                      {profile.license_number}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Carte CIN */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🆔</span>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-800 text-sm">CIN</h4>
                  <p className="text-cyan-700 font-medium">
                    {(profile as any).cin || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Modifier le profil
          </button>
          <button
            onClick={() => router.push("/change-password")}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Modifier mot de passe
          </button>
        </div>

        {/* Modal d'édition */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Modifier le profil
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Colonne 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={editData.first_name}
                      onChange={(e) =>
                        setEditData({ ...editData, first_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editData.last_name}
                      onChange={(e) =>
                        setEditData({ ...editData, last_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editData.phone_number}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CIN
                    </label>
                    <input
                      type="text"
                      value={editData.cin}
                      onChange={(e) =>
                        setEditData({ ...editData, cin: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="arbitre">Arbitre Principal</option>
                      <option value="assistant">Arbitre Assistant</option>
                    </select>
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <select
                      value={editData.grade}
                      onChange={(e) =>
                        setEditData({ ...editData, grade: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Sélectionner un grade</option>
                      {GRADES.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                          {grade.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={editData.birth_date}
                      onChange={(e) =>
                        setEditData({ ...editData, birth_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de naissance
                    </label>
                    <input
                      type="text"
                      value={editData.birth_place}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          birth_place: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ligue
                    </label>
                    <select
                      value={editData.ligue}
                      onChange={(e) =>
                        setEditData({ ...editData, ligue: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Sélectionner une ligue</option>
                      <option value="1">Ligue de Tunis</option>
                      <option value="2">Ligue de Sfax</option>
                      <option value="3">Ligue de Sousse</option>
                      <option value="4">Ligue de Bizerte</option>
                      <option value="5">Ligue de Monastir</option>
                      <option value="6">Ligue de Gabès</option>
                      <option value="7">Ligue de Gafsa</option>
                      <option value="8">Ligue de Kairouan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup des options de photo */}
        {showPhotoOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Options de photo
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPhotoOptions(false);
                    setShowFullImage(true);
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  Voir la photo
                </button>

                <label className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span>📷</span>
                  {isUploading ? "Modification..." : "Modifier la photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <button
                  onClick={() => setShowPhotoOptions(false)}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup d'affichage plein écran de la photo */}
        {showFullImage && profile?.profile_photo && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-colors z-10"
              >
                ✕
              </button>

              <OptimizedImage
                src={
                  profile.profile_photo.startsWith("http")
                    ? profile.profile_photo
                    : `${getBackendUrl()}${profile.profile_photo}`
                }
                alt="Photo de profil"
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={() => {
                  console.error(
                    "Erreur de chargement de l'image en plein écran"
                  );
                }}
                priority={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
