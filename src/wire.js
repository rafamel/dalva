import registry from './registry';
import {
  // Base
  Node,
  Collection,
  Raw,
  // Sections
  Sections,
  Section,
  // Content
  Content,
  Markdown,
  // Mod
  Mod,
  Sources,
  Resources
} from './components';

// Base
registry.add(Node);
registry.add(Collection);
registry.add(Raw);

// Sections
registry.add(Sections, 'sections');
registry.add(Section, 'sections', 'child');

// Content
registry.add(Content, 'content');
registry.add(Markdown, 'content', 'md');

// Mod
registry.add(Mod, 'mod');
registry.add(Sources, 'mod', 'sources');
registry.add(Resources, 'mod', 'resources');
