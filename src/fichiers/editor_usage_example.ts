// src/app/(platform)/(author)/stories/[storyId]/chapters/[chapterId]/edit/page.tsx

'use client';

import { TiptapEditor } from '@/components/author/editor/tiptap-editor';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

/**
 * Page d'édition d'un chapitre
 * 
 * ARCHITECTURE :
 * 1. Charge le contenu depuis l'API
 * 2. Passe le contenu au TiptapEditor
 * 3. Sauvegarde automatiquement (ou manuellement)
 * 4. Affiche le statut de sauvegarde
 */
export default function ChapterEditPage() {
  const params = useParams();
  const { storyId, chapterId } = params;

  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState<any>(null);

  /**
   * Charge le chapitre depuis l'API au montage du composant
   */
  useEffect(() => {
    async function loadChapter() {
      try {
        const response = await fetch(`/api/chapters/${chapterId}`);
        const data = await response.json();
        
        setChapter(data);
        setContent(data.content); // Le JSON Tiptap sauvegardé
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadChapter();
  }, [chapterId]);

  /**
   * Sauvegarde le contenu en base de données
   * 
   * CETTE FONCTION SERA APPELÉE :
   * - Automatiquement toutes les 30 secondes (autosave)
   * - Manuellement si l'utilisateur clique sur "Sauvegarder"
   */
  const handleSave = async (json: any) => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: json,
          // On pourrait aussi sauvegarder d'autres infos :
          // wordCount: json.content.reduce((acc, node) => acc + (node.text?.split(' ').length || 0), 0)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur de sauvegarde');
      }

      console.log('✅ Chapitre sauvegardé');
    } catch (error) {
      console.error('❌ Erreur de sauvegarde:', error);
      // TODO : Afficher une notification d'erreur à l'utilisateur
    }
  };

  /**
   * Callback appelé à chaque modification (optionnel)
   * Ici on pourrait faire des analytics en temps réel
   */
  const handleUpdate = (json: any) => {
    setContent(json);
    
    // Exemple : calculer les mots en temps réel
    const wordCount = calculateWordCount(json);
    console.log('Nombre de mots:', wordCount);
  };

  /**
   * Helper : Calculer le nombre de mots depuis le JSON Tiptap
   */
  const calculateWordCount = (json: any): number => {
    if (!json || !json.content) return 0;
    
    let count = 0;
    const traverse = (node: any) => {
      if (node.text) {
        count += node.text.trim().split(/\s+/).length;
      }
      if (node.content) {
        node.content.forEach(traverse);
      }
    };
    
    json.content.forEach(traverse);
    return count;
  };

  /**
   * État de chargement
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du chapitre...</p>
        </div>
      </div>
    );
  }

  /**
   * Interface principale
   */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {chapter?.title || 'Nouveau chapitre'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Histoire : {chapter?.story?.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton Preview */}
            <button
              onClick={() => {
                // TODO : Ouvrir un modal de prévisualisation en mode lecteur
                console.log('Preview');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              👁️ Aperçu
            </button>

            {/* Bouton Publier */}
            <button
              onClick={() => {
                // TODO : Changer le statut du chapitre en "published"
                console.log('Publier');
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              🚀 Publier
            </button>
          </div>
        </div>
      </header>

      {/* Zone d'édition */}
      <main className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <TiptapEditor
            content={content}
            onUpdate={handleUpdate}
            onSave={handleSave}
            placeholder="Commencez à écrire votre chapitre..."
            autoSave={true}
            autoSaveDelay={30000} // 30 secondes
            className="min-h-screen"
          />
        </div>
      </main>
    </div>
  );
}

/**
 * PROCHAINES ÉTAPES :
 * 
 * 1. Créer l'API Route `/api/chapters/[chapterId]` (GET et PATCH)
 * 2. Créer le Media Manager (modal pour uploader et sélectionner des médias)
 * 3. Créer le modal de configuration des Triggers
 * 4. Implémenter la prévisualisation en mode lecteur
 * 5. Ajouter le versioning (historique des modifications)
 * 
 * STRUCTURE DE LA BASE DE DONNÉES (rappel) :
 * 
 * Table: chapters
 * - id: string
 * - title: string
 * - content: JSON  <-- Le JSON Tiptap est stocké ici
 * - storyId: string
 * - order: number
 * - status: enum (draft, published)
 * - createdAt: Date
 * - updatedAt: Date
 * 
 * Exemple de contenu JSON sauvegardé :
 * {
 *   "type": "doc",
 *   "content": [
 *     {
 *       "type": "heading",
 *       "attrs": { "level": 1 },
 *       "content": [{ "type": "text", "text": "Chapitre 1" }]
 *     },
 *     {
 *       "type": "paragraph",
 *       "content": [{ "type": "text", "text": "Il était une fois..." }]
 *     },
 *     {
 *       "type": "triggerAmbiance",
 *       "attrs": {
 *         "id": "trigger-123",
 *         "type": "audio",
 *         "mediaUrl": "https://r2.../ambiance.mp3",
 *         "action": "fade-in",
 *         "fadeInDuration": 3000,
 *         "loop": true,
 *         "volume": 0.7
 *       }
 *     },
 *     {
 *       "type": "paragraph",
 *       "content": [{ "type": "text", "text": "La forêt était sombre..." }]
 *     }
 *   ]
 * }
 */