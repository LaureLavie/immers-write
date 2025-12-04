// src/components/author/editor/editor.types.ts

import { Editor } from '@tiptap/react';

/**
 * Type pour les triggers immersifs
 * Ce sont les "points de déclenchement" que l'auteur place dans le texte
 */
export interface TriggerAmbianceAttrs {
  id: string;                    // ID unique du trigger
  type: 'audio' | 'image' | 'video';  // Type de média
  mediaUrl: string;              // URL du fichier (depuis R2)
  mediaId?: string;              // ID dans la bibliothèque média
  action: 'play' | 'stop' | 'fade-in' | 'fade-out';
  fadeInDuration?: number;       // Durée du fondu (en ms)
  fadeOutDuration?: number;
  loop?: boolean;                // Pour l'audio : lecture en boucle ?
  volume?: number;               // Volume de 0 à 1
}

/**
 * Type pour les blocs audio
 * Représentation visuelle dans l'éditeur
 */
export interface AudioBlockAttrs {
  src: string;                   // URL du fichier audio
  title?: string;                // Nom du fichier
  duration?: number;             // Durée en secondes
  mediaId?: string;              // Référence vers Media table
}

/**
 * Type pour les blocs image enrichis
 * Extension de l'extension Image de base
 */
export interface ImageBlockAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  mediaId?: string;
  caption?: string;              // Légende de l'image
  alignment?: 'left' | 'center' | 'right' | 'full';
}

/**
 * Props du composant TiptapEditor principal
 */
export interface TiptapEditorProps {
  content?: string | object;     // Contenu initial (JSON ou HTML)
  onUpdate?: (content: object) => void;  // Callback à chaque modification
  onSave?: (content: object) => void;    // Callback sur sauvegarde manuelle
  placeholder?: string;          // Texte placeholder
  editable?: boolean;            // Mode lecture seule ?
  className?: string;
  autoSave?: boolean;            // Activer l'autosave ?
  autoSaveDelay?: number;        // Délai autosave (ms)
}

/**
 * Props pour la barre d'outils
 */
export interface ToolbarProps {
  editor: Editor | null;
  onInsertMedia?: () => void;    // Ouvre le Media Manager
  onInsertTrigger?: () => void;  // Insère un trigger
}

/**
 * Type pour le contenu sauvegardé
 * C'est ce qui sera stocké en base de données (colonne JSON)
 */
export interface ChapterContent {
  type: 'doc';
  content: any[];                // Array de nodes ProseMirror
}

/**
 * Metadata pour analytics auteur
 */
export interface EditorMetadata {
  wordCount: number;
  characterCount: number;
  readingTime: number;           // En minutes
  lastSaved?: Date;
  version?: number;
}