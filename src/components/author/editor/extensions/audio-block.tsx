// src/components/author/editor/extensions/audio-block.tsx

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { AudioBlockAttrs } from '../editor.types';
import { Volume2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

/**
 * Extension Tiptap pour créer des blocs audio
 * 
 * POURQUOI UNE EXTENSION CUSTOM ?
 * Tiptap ne gère pas l'audio nativement. On doit créer un "Node" custom
 * qui sera inséré dans le document comme un paragraphe ou une image.
 */
export const AudioBlock = Node.create({
  name: 'audioBlock',           // Nom unique de l'extension
  group: 'block',               // C'est un élément "block" (comme <p> ou <h1>)
  atom: true,                   // "Atomique" = indivisible, pas de contenu texte dedans
  
  /**
   * Définit les attributs que ce node peut avoir
   * Ces attributs seront stockés dans le JSON final
   */
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('data-src'),
        renderHTML: attributes => ({ 'data-src': attributes.src }),
      },
      title: {
        default: 'Audio sans titre',
      },
      duration: {
        default: 0,
      },
      mediaId: {
        default: null,
      },
    };
  },

  /**
   * Définit comment ce node est parsé depuis le HTML
   * (si on colle du HTML dans l'éditeur)
   */
  parseHTML() {
    return [
      {
        tag: 'div[data-type="audio-block"]',
      },
    ];
  },

  /**
   * Définit comment ce node est rendu en HTML
   * (si on exporte en HTML)
   */
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'audio-block' })];
  },

  /**
   * LE PLUS IMPORTANT : Le rendu React dans l'éditeur
   * On utilise un composant React pour afficher un lecteur audio stylisé
   */
  addNodeView() {
    return ReactNodeViewRenderer(AudioBlockComponent);
  },

  /**
   * Commande pour insérer un bloc audio depuis le code
   * Utilisée par le Media Manager quand on glisse-dépose un audio
   */
  addCommands() {
    return {
      setAudioBlock: (attributes: AudioBlockAttrs) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        });
      },
    };
  },
});

/**
 * Composant React qui affiche le bloc audio DANS l'éditeur
 * 
 * PROPS :
 * - node : Contient les attributs (src, title, etc.)
 * - deleteNode : Fonction pour supprimer ce bloc
 * - selected : Si le bloc est sélectionné (pour le style)
 */
function AudioBlockComponent({ node, deleteNode, selected }: any) {
  const { src, title, duration } = node.attrs as AudioBlockAttrs;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <NodeViewWrapper className="audio-block-wrapper">
      <div 
        className={`
          relative flex items-center gap-4 p-4 rounded-lg border-2 
          transition-all duration-200
          ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}
          hover:border-indigo-300 hover:shadow-md
        `}
      >
        {/* Icône Audio */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
          <p className="text-sm text-gray-500">
            {duration ? formatDuration(duration) : 'Durée inconnue'}
          </p>
        </div>

        {/* Bouton Play (preview) */}
        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Bouton Supprimer */}
        <button
          onClick={deleteNode}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Supprimer ce bloc audio"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Element audio caché (pour preview) */}
        <audio 
          ref={audioRef} 
          src={src}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
    </NodeViewWrapper>
  );
}

/**
 * RÉSUMÉ DE CE QUE FAIT CETTE EXTENSION :
 * 
 * 1. Définit un nouveau type de "block" dans Tiptap (comme <p> ou <img>)
 * 2. Stocke les infos audio (src, title, duration) dans les attributs
 * 3. Affiche un composant React stylisé dans l'éditeur
 * 4. Permet de preview l'audio directement dans l'éditeur
 * 5. Peut être supprimé avec un bouton
 * 6. Sera sauvegardé en JSON dans la base de données
 * 
 * EXEMPLE DE JSON GÉNÉRÉ :
 * {
 *   "type": "audioBlock",
 *   "attrs": {
 *     "src": "https://r2.../ambiance-foret.mp3",
 *     "title": "Ambiance Forêt",
 *     "duration": 180,
 *     "mediaId": "cm3x..."
 *   }
 * }
 */