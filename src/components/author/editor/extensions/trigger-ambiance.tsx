// src/components/author/editor/extensions/trigger-ambiance.tsx

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { TriggerAmbianceAttrs } from '../editor.types';
import { Play, Pause, Volume2, Image, Video, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Extension pour les "Triggers Immersifs"
 * 
 * QU'EST-CE QU'UN TRIGGER ?
 * C'est un bloc INVISIBLE pour le lecteur qui déclenche une action
 * quand il scroll jusqu'à ce point du texte :
 * - Lancer une musique d'ambiance
 * - Afficher une image en fond
 * - Jouer une vidéo en overlay
 * 
 * DIFFÉRENCE AVEC AudioBlock :
 * - AudioBlock = visible, pour montrer "il y a un son ici"
 * - TriggerAmbiance = invisible, pour créer l'immersion automatique
 */
export const TriggerAmbiance = Node.create({
  name: 'triggerAmbiance',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => ({ 'data-id': attributes.id }),
      },
      type: {
        default: 'audio',
        parseHTML: element => element.getAttribute('data-trigger-type'),
        renderHTML: attributes => ({ 'data-trigger-type': attributes.type }),
      },
      mediaUrl: {
        default: null,
        parseHTML: element => element.getAttribute('data-media-url'),
        renderHTML: attributes => ({ 'data-media-url': attributes.mediaUrl }),
      },
      mediaId: {
        default: null,
      },
      action: {
        default: 'play',
      },
      fadeInDuration: {
        default: 2000,  // 2 secondes par défaut
      },
      fadeOutDuration: {
        default: 2000,
      },
      loop: {
        default: false,
      },
      volume: {
        default: 0.7,   // 70% du volume max
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="trigger-ambiance"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div', 
      mergeAttributes(HTMLAttributes, { 
        'data-type': 'trigger-ambiance',
        'class': 'trigger-ambiance-marker' // Pour IntersectionObserver côté lecteur
      })
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TriggerAmbianceComponent);
  },

  addCommands() {
    return {
      setTriggerAmbiance: (attributes: TriggerAmbianceAttrs) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            ...attributes,
            id: attributes.id || `trigger-${Date.now()}`, // Génère un ID unique
          },
        });
      },
    };
  },
});

/**
 * Composant visuel du Trigger dans l'éditeur
 * 
 * DESIGN :
 * - Visible pour l'auteur (avec icône et infos)
 * - Sera invisible pour le lecteur (rendu HTML différent)
 * - Style "badge" subtil pour ne pas perturber la lecture en écriture
 */
function TriggerAmbianceComponent({ node, updateAttributes, deleteNode, selected }: any) {
  const attrs = node.attrs as TriggerAmbianceAttrs;
  const [showSettings, setShowSettings] = useState(false);

  // Icône selon le type de média
  const MediaIcon = {
    audio: Volume2,
    image: Image,
    video: Video,
  }[attrs.type];

  // Couleur selon le type
  const colorClasses = {
    audio: 'from-indigo-500 to-purple-600 border-indigo-300',
    image: 'from-blue-500 to-cyan-600 border-blue-300',
    video: 'from-pink-500 to-rose-600 border-pink-300',
  }[attrs.type];

  return (
    <NodeViewWrapper className="trigger-ambiance-wrapper">
      <div 
        className={`
          relative my-4 p-3 rounded-lg border-2 border-dashed
          transition-all duration-200
          ${selected ? `${colorClasses} bg-opacity-10` : 'border-gray-300 bg-gray-50'}
          hover:shadow-md
        `}
      >
        <div className="flex items-center gap-3">
          {/* Badge avec icône */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} flex items-center justify-center`}>
            <MediaIcon className="w-5 h-5 text-white" />
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-700">
                🎬 Trigger {attrs.type === 'audio' ? '🔊' : attrs.type === 'image' ? '🖼️' : '🎥'}
              </span>
              <span className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-600">
                {attrs.action}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-1">
              {attrs.mediaUrl ? new URL(attrs.mediaUrl).pathname.split('/').pop() : 'Aucun média'}
            </p>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white rounded-md transition-colors"
              title="Paramètres"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={deleteNode}
              className="p-2 hover:bg-red-50 rounded-md transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Panneau de paramètres (toggle) */}
        {showSettings && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
            {/* Action */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={attrs.action}
                onChange={(e) => updateAttributes({ action: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="play">Play</option>
                <option value="stop">Stop</option>
                <option value="fade-in">Fade In</option>
                <option value="fade-out">Fade Out</option>
              </select>
            </div>

            {/* Fade In Duration (si fade-in) */}
            {(attrs.action === 'fade-in' || attrs.action === 'play') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Durée Fade In (ms)
                </label>
                <input
                  type="number"
                  value={attrs.fadeInDuration}
                  onChange={(e) => updateAttributes({ fadeInDuration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="500"
                />
              </div>
            )}

            {/* Volume (si audio) */}
            {attrs.type === 'audio' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Volume ({Math.round(attrs.volume * 100)}%)
                </label>
                <input
                  type="range"
                  value={attrs.volume}
                  onChange={(e) => updateAttributes({ volume: parseFloat(e.target.value) })}
                  className="w-full"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            )}

            {/* Loop (si audio) */}
            {attrs.type === 'audio' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attrs.loop}
                  onChange={(e) => updateAttributes({ loop: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700">
                  Lecture en boucle
                </label>
              </div>
            )}
          </div>
        )}

        {/* Indicateur visuel : "Ce bloc est invisible pour le lecteur" */}
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-sm">
          👻 Invisible
        </div>
      </div>
    </NodeViewWrapper>
  );
}

/**
 * COMMENT ÇA FONCTIONNE CÔTÉ LECTEUR ?
 * 
 * 1. Ce bloc est rendu avec la classe "trigger-ambiance-marker"
 * 2. Un IntersectionObserver détecte quand il entre dans le viewport
 * 3. Le lecteur déclenche l'action (play audio, show image, etc.)
 * 4. Les paramètres (fade, volume, loop) sont lus depuis les attributs
 * 
 * EXEMPLE D'USAGE :
 * L'auteur écrit :
 * "La forêt était silencieuse..."
 * [TRIGGER: Audio - ambiance-foret.mp3, fade-in 3s, loop]
 * "...quand soudain, un cri retentit."
 * 
 * Le lecteur voit :
 * "La forêt était silencieuse... quand soudain, un cri retentit."
 * (avec la musique qui démarre doucement au milieu)
 */