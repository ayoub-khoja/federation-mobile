"use client";

import React, { useState, useEffect } from 'react';

interface ApiTestResult {
  name: string;
  endpoint: string;
  method: string;
  status: string;
  statusCode?: number;
  statusText?: string;
  response?: any;
  error?: string;
  timestamp: string;
}

interface HealthCheckResponse {
  success: boolean;
  message: string;
  environment: string;
  baseUrl: string;
  timestamp: string;
  summary: {
    total: number;
    success: number;
    error: number;
    skipped: number;
  };
  results: ApiTestResult[];
}

export default function TestAPIsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const accessToken = localStorage.getItem('access_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch('/api/health-check', {
        method: 'GET',
        headers
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.message || 'Erreur lors du test des API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SKIPPED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return '✅';
      case 'ERROR':
        return '❌';
      case 'SKIPPED':
        return '⏭️';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🔍 Test des API
            </h1>
            <p className="text-gray-600 mb-6">
              Vérification du fonctionnement de toutes les API en local et production
            </p>
            
            <button
              onClick={runHealthCheck}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '⏳ Test en cours...' : '🚀 Lancer les tests'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <div>
                  <h3 className="font-semibold text-red-800">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results && (
            <>
              {/* Résumé */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">📊 Résumé des tests</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{results.summary.total}</div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{results.summary.success}</div>
                    <div className="text-sm text-green-700">Succès</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{results.summary.error}</div>
                    <div className="text-sm text-red-700">Erreurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{results.summary.skipped}</div>
                    <div className="text-sm text-yellow-700">Ignorés</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Environnement:</strong> {results.environment}</p>
                  <p><strong>URL de base:</strong> {results.baseUrl}</p>
                  <p><strong>Timestamp:</strong> {new Date(results.timestamp).toLocaleString('fr-FR')}</p>
                </div>
              </div>

              {/* Détails des tests */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Détails des tests</h2>
                
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(result.status)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{result.name}</h3>
                          <p className="text-sm opacity-75">
                            {result.method} {result.endpoint}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {result.statusCode && (
                          <div className="text-sm font-mono">
                            {result.statusCode} {result.statusText}
                          </div>
                        )}
                        <div className="text-xs opacity-75">
                          {new Date(result.timestamp).toLocaleTimeString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    {result.error && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                        <strong>Erreur:</strong> {result.error}
                      </div>
                    )}

                    {result.response && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">
                          Voir la réponse
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">📋 Instructions</h2>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>1.</strong> Cliquez sur "Lancer les tests" pour vérifier toutes les API</p>
              <p><strong>2.</strong> Les tests avec authentification nécessitent d'être connecté</p>
              <p><strong>3.</strong> Vérifiez que le backend Django est démarré sur le port 8000</p>
              <p><strong>4.</strong> Les tests POST peuvent créer des données de test</p>
              <p><strong>5.</strong> En production, l'URL de base sera automatiquement détectée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
