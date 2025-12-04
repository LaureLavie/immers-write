// src/components/author/editor/tiptap-editor.tsx

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useCallback, useState } from 'react';

// Nos extensions custom
import { AudioBlock } from './extensions/audio-block';
import { TriggerAmbiance } from './extensions/trigger-ambiance';

// Composants
import { Toolbar } from './toolbar';
import { TiptapEditorProps } from './editor.types';

/**
 * TiptapEditor - Composant principal de l'éditeur
 * 
 * RÔLE :
 * - Initialise Tiptap avec toutes les extensions
 * - Gère l'autosave (sauvegarde automatique)
 * - Fournit les callbacks pour insérer média/triggers
 * - Affiche la toolbar et l'éditeur
 * 
 * PROPS :
 * - content : Contenu initial (JSON Tiptap ou string)
 * - onUpdate : Callback appelé à chaque modification
 * - autoSave : Active l'autosave (défaut: true)
 * - autoSaveDelay : Délai avant sauvegarde (défaut: 30s)
 */
export function TiptapEditor({
  content,
  onUpdate,
  onSave,
  placeholder = 'Commencez à écrire votre histoire...',
  editable = true,
  className = '',
  autoSave = true,
  autoSaveDelay = 30000, // 30 secondes
}: TiptapEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /**
   * Initialisation de l'éditeur Tiptap
   * 
   * useEditor() :
   * - Crée une instance Editor
   * - Configure les extensions
   * - Gère le contenu initial
   * - Configure les callbacks
   */
  const editor = useEditor({
    extensions: [
      // Extensions de base (gras, italique, listes, etc.)
      StarterKit.configure({
        // On désactive l'histoire native car on va gérer la sauvegarde nous-mêmes
        history: {
          depth: 100, // Garde 100 états en mémoire
        },
      }),

      // Placeholder (texte d'aide quand vide)
      Placeholder.configure({
        placeholder: ({ node }) => {
          // Placeholder différent selon le type de node
          if (node.type.name === 'heading') {
            return 'Titre du chapitre...';
          }
          return placeholder;
        },
      }),

      // Image de base (on pourrait créer ImageBlock custom plus tard)
      Image.configure({
        inline: false,
        allowBase64: false, // On force l'upload vers R2
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto',
        },
      }),

      // Liens
      Link.configure({
        openOnClick: false, // Ne suit pas les liens en mode édition
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-800',
        },
      }),

      // Compteur de caractères/mots (pour la toolbar)
      CharacterCount,

      // NOS EXTENSIONS CUSTOM 🎉
      AudioBlock,
      TriggerAmbiance,
    ],

    // Contenu initial
    content: content || '',

    // Mode éditable ?
    editable,

    // Callback à chaque modification
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate?.(json);
    },

    // Classes CSS de l'éditeur
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-4',
      },
    },
  });

  /**
   * Autosave - Sauvegarde automatique
   * 
   * LOGIQUE :
   * 1. Attend autoSaveDelay ms après la dernière modification
   * 2. Appelle onSave() avec le contenu JSON
   * 3. Met à jour lastSaved pour afficher "Sauvegardé à 14h32"
   */
  useEffect(() => {
    if (!autoSave || !editor || !onSave) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      const json = editor.getJSON();
      
      onSave(json);
      setLastSaved(new Date());
      
      setTimeout(() => setIsSaving(false), 1000);
    }, autoSaveDelay);

    // Nettoie le timer si l'utilisateur continue de taper
    return () => clearTimeout(timer);
  }, [editor?.state.doc, autoSave, autoSaveDelay, onSave]);

  /**
   * Callback : Ouvrir le Media Manager
   * 
   * TODO : Implémenter le Media Manager (modal avec bibliothèque)
   * Pour l'instant, on simule avec un input file
   */
  const handleInsertMedia = useCallback(() => {
    if (!editor) return;

    // Simulation : demande d'upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,audio/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // TODO : Upload vers R2 et récupérer l'URL
      // Pour l'instant, on crée une URL locale
      const url = URL.createObjectURL(file);

      // Insère selon le type
      if (file.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: url }).run();
      } else if (file.type.startsWith('audio/')) {
        editor.chain().focus().setAudioBlock({
          src: url,
          title: file.name,
          duration: 0, // TODO : détecter la durée
        }).run();
      }
    };

    input.click();
  }, [editor]);

  /**
   * Callback : Insérer un Trigger
   * 
   * TODO : Modal avec formulaire pour configurer le trigger
   * Pour l'instant, on insère un trigger par défaut
   */
  const handleInsertTrigger = useCallback(() => {
    if (!editor) return;

    // Simulation : trigger audio par défaut
    editor.chain().focus().setTriggerAmbiance({
      id: `trigger-${Date.now()}`,
      type: 'audio',
      mediaUrl: 'https://example.com/ambiance.mp3',
      action: 'fade-in',
      fadeInDuration: 3000,
      loop: true,
      volume: 0.7,
    }).run();
  }, [editor]);

  /**
   * Formater le temps de dernière sauvegarde
   */
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    return lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`tiptap-editor-container ${className}`}>
      {/* Barre d'outils */}
      <Toolbar
        editor={editor}
        onInsertMedia={handleInsertMedia}
        onInsertTrigger={handleInsertTrigger}
      />

      {/* Zone d'édition */}
      <div className="relative">
        <EditorContent editor={editor} />

        {/* Indicateur de sauvegarde */}
        {autoSave && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-md text-sm">
            {isSaving ? (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-gray-600">Sauvegarde...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-gray-600">
                  Sauvegardé {formatLastSaved()}
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Métadonnées en bas (optionnel) */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>
            📝 {editor?.storage.characterCount?.words() || 0} mots
          </span>
          <span>
            ⏱️ {Math.ceil((editor?.storage.characterCount?.words() || 0) / 200)} min de lecture
          </span>
        </div>
        
        {onSave && (
          <button
            onClick={() => {
              if (editor) {
                onSave(editor.getJSON());
                setLastSaved(new Date());
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            💾 Sauvegarder maintenant
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * RÉSUMÉ DE CE QUE FAIT CE COMPOSANT :
 * 
 * 1. Initialise Tiptap avec toutes les extensions
 * 2. Gère l'autosave (30s par défaut)
 * 3. Affiche la toolbar avec tous les boutons
 * 4. Permet d'insérer des médias et triggers
 * 5. Affiche les métadonnées (mots, temps de lecture)
 * 6. Montre le statut de sauvegarde
 * 
 * COMMENT L'UTILISER DANS UNE PAGE :
 * 
 * ```tsx
 * 'use client';
 * import { TiptapEditor } from '@/components/author/editor/tiptap-editor';
 * import { useState } from 'react';
 * 
 * export default function ChapterEditPage() {
 *   const [content, setContent] = useState(null);
 * 
 *   const handleSave = async (json) => {
 *     // Appel API pour sauvegarder en base
 *     await fetch('/api/chapters/123', {
 *       method: 'PATCH',
 *       body: JSON.stringify({ content: json }),
 *     });
 *   };
 * 
 *   return (
 *     <TiptapEditor
 *       content={content}
 *       onUpdate={setContent}
 *       onSave={handleSave}
 *       autoSave={true}
 *       autoSaveDelay={30000}
 *     />
 *   );
 * }
 * ```
 */