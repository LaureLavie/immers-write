// src/components/author/editor/toolbar.tsx

import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image,
  Volume2,
  Sparkles,
  Code,
  Link,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onInsertMedia?: () => void;      // Ouvre le Media Manager
  onInsertTrigger?: () => void;    // Insère un Trigger
}

/**
 * Toolbar - Barre d'outils de formatage
 * 
 * DESIGN PATTERN :
 * - Chaque bouton appelle une "commande" Tiptap
 * - Les commandes modifient l'état de l'éditeur
 * - Tiptap s'occupe de la logique de formatage
 * 
 * STYLE :
 * - Sticky top (reste visible au scroll)
 * - Style glassmorphism (selon votre charte)
 * - Groupes logiques (texte, titres, listes, média)
 */
export function Toolbar({ editor, onInsertMedia, onInsertTrigger }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  /**
   * Composant bouton réutilisable
   * 
   * PROPS :
   * - onClick : Action à effectuer
   * - isActive : Si le format est actif (ex: texte sélectionné en gras)
   * - icon : Icône Lucide
   * - title : Tooltip
   */
  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    icon: any; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-md transition-all duration-200
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-700 hover:bg-gray-100'
        }
        hover:scale-105 active:scale-95
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  /**
   * Séparateur visuel entre groupes de boutons
   */
  const Divider = () => (
    <div className="w-px h-8 bg-gray-300 mx-2" />
  );

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-1 p-2 flex-wrap">
        {/* Groupe : Historique */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
          title="Annuler (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
          title="Refaire (Ctrl+Y)"
        />

        <Divider />

        {/* Groupe : Formatage texte */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Gras (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italique (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          title="Barré"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Code inline"
        />

        <Divider />

        {/* Groupe : Titres */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Titre 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Titre 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Titre 3"
        />

        <Divider />

        {/* Groupe : Listes */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Liste à puces"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Liste numérotée"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Citation"
        />

        <Divider />

        {/* Groupe : Média (vos extensions custom) */}
        <button
          onClick={onInsertMedia}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          title="Insérer une image/audio"
        >
          <Image className="w-5 h-5" />
          <span className="text-sm font-medium">Média</span>
        </button>

        <button
          onClick={onInsertTrigger}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          title="Insérer un trigger immersif"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Trigger</span>
        </button>

        {/* Info : Nombre de mots (à droite) */}
        <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
          <span>
            {editor.storage.characterCount?.words() || 0} mots
          </span>
          <span>
            {editor.storage.characterCount?.characters() || 0} caractères
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * RACCOURCIS CLAVIER DISPONIBLES (gérés par Tiptap) :
 * 
 * - Ctrl+B : Gras
 * - Ctrl+I : Italique
 * - Ctrl+Z : Annuler
 * - Ctrl+Y : Refaire
 * - Ctrl+Shift+1/2/3 : Titres H1/H2/H3
 * - Ctrl+Shift+8 : Liste à puces
 * - Ctrl+Shift+7 : Liste numérotée
 * 
 * Ces raccourcis sont natifs dans StarterKit !
 */