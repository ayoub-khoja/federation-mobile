import { useState } from 'react';
import { matchService, CreateMatchData } from '../services/matchService';

export interface MatchFormData {
  matchType: string;
  category: string;
  stadium: string;
  matchDate: string;
  matchTime: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  role: string;
  description: string;
  matchSheet: File | null;
}

const initialFormData: MatchFormData = {
  matchType: '',
  category: '',
  stadium: '',
  matchDate: '',
  matchTime: '',
  homeTeam: '',
  awayTeam: '',
  homeScore: '',
  awayScore: '',
  role: 'arbitre_principal',
  description: '',
  matchSheet: null
};

export const useMatchForm = () => {
  const [matchForm, setMatchForm] = useState<MatchFormData>(initialFormData);
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [showExcuseForm, setShowExcuseForm] = useState(false);
  const [showExcuseHistory, setShowExcuseHistory] = useState(false);

  const handleFormInputChange = (field: string, value: string) => {
    setMatchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (file: File | null) => {
    setMatchForm(prev => ({
      ...prev,
      matchSheet: file
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'matchType',
      'category', 
      'stadium',
      'matchDate',
      'matchTime',
      'homeTeam',
      'awayTeam',
      'role'
    ];

    for (const field of requiredFields) {
      if (!matchForm[field as keyof MatchFormData] || matchForm[field as keyof MatchFormData] === '') {
        alert(`Le champ ${field} est obligatoire`);
        return false;
      }
    }

    // Validation de la date (ne doit pas être dans le passé)
    const matchDateTime = new Date(`${matchForm.matchDate}T${matchForm.matchTime}`);
    const now = new Date();
    
    if (matchDateTime < now) {
      alert('La date et l\'heure du match ne peuvent pas être dans le passé');
      return false;
    }

    // Validation des équipes (ne doivent pas être identiques)
    if (matchForm.homeTeam.toLowerCase() === matchForm.awayTeam.toLowerCase()) {
      alert('Les équipes domicile et visiteur ne peuvent pas être identiques');
      return false;
    }

    return true;
  };

  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Transformer les données du formulaire au format API
      const apiData: CreateMatchData = {
        type_match: parseInt(matchForm.matchType),
        categorie: parseInt(matchForm.category),
        stadium: matchForm.stadium,
        match_date: matchForm.matchDate,
        match_time: matchForm.matchTime,
        home_team: matchForm.homeTeam,
        away_team: matchForm.awayTeam,
        home_score: matchForm.homeScore ? parseInt(matchForm.homeScore) : undefined,
        away_score: matchForm.awayScore ? parseInt(matchForm.awayScore) : undefined,
        role: matchForm.role,
        description: matchForm.description || undefined,
        match_sheet: matchForm.matchSheet || undefined
      };

      console.log('Envoi des données du match:', apiData);
      
      const response = await matchService.createMatch(apiData);
      
      if (response.success) {
        alert('Match enregistré avec succès !');
        setShowAddMatchForm(false);
        resetForm();
      } else {
        alert('Erreur lors de l\'enregistrement du match');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du match:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const resetForm = () => {
    setMatchForm(initialFormData);
  };

  const handleAddMatchClick = () => {
    setShowAddMatchForm(true);
    setShowMatchHistory(false);
    setShowExcuseForm(false);
    setShowExcuseHistory(false);
  };

  const handleHistoryClick = () => {
    setShowMatchHistory(true);
    setShowAddMatchForm(false);
    setShowExcuseForm(false);
    setShowExcuseHistory(false);
  };

  const handleExcuseClick = () => {
    setShowExcuseForm(true);
    setShowAddMatchForm(false);
    setShowMatchHistory(false);
    setShowExcuseHistory(false);
  };

  const handleExcuseHistoryClick = () => {
    setShowExcuseHistory(true);
    setShowAddMatchForm(false);
    setShowMatchHistory(false);
    setShowExcuseForm(false);
  };

  const handleCancelForm = () => {
    setShowAddMatchForm(false);
    setShowMatchHistory(false);
    setShowExcuseForm(false);
    setShowExcuseHistory(false);
    resetForm();
  };

  return {
    matchForm,
    showAddMatchForm,
    showMatchHistory,
    showExcuseForm,
    showExcuseHistory,
    handleFormInputChange,
    handleFileUpload,
    handleSubmitMatch,
    handleAddMatchClick,
    handleHistoryClick,
    handleExcuseClick,
    handleExcuseHistoryClick,
    handleCancelForm,
    resetForm
  };
};
