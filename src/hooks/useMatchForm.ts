import { useState } from 'react';

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
  description: '',
  matchSheet: null
};

export const useMatchForm = () => {
  const [matchForm, setMatchForm] = useState<MatchFormData>(initialFormData);
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [showMatchHistory, setShowMatchHistory] = useState(false);

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

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Match data:', matchForm);
    // Ici, vous pouvez traiter les données du match
    alert('Match enregistré avec succès !');
    setShowAddMatchForm(false);
    resetForm();
  };

  const resetForm = () => {
    setMatchForm(initialFormData);
  };

  const handleAddMatchClick = () => {
    setShowAddMatchForm(true);
    setShowMatchHistory(false);
  };

  const handleHistoryClick = () => {
    setShowMatchHistory(true);
    setShowAddMatchForm(false);
  };

  const handleCancelForm = () => {
    setShowAddMatchForm(false);
    setShowMatchHistory(false);
    resetForm();
  };

  return {
    matchForm,
    showAddMatchForm,
    showMatchHistory,
    handleFormInputChange,
    handleFileUpload,
    handleSubmitMatch,
    handleAddMatchClick,
    handleHistoryClick,
    handleCancelForm,
    resetForm
  };
};
