# Contributing to Lynxjs Snippets .tsx

## Welcome! 🌟

Thank you for your interest in contributing to **Lynxjs Snippets**! We're excited to have you join our community of developers who are passionate about creating optimized code snippets for the Lynxjs framework across all code editors.

Whether you want to add support for new editors, create new Lynxjs snippets, improve existing snippet patterns, or enhance documentation, your contributions are valuable and welcome.

## Understanding the Project 🏗️

Before diving into contributions, we recommend reading our [**Architecture Documentation**](https://github.com/bastndev/Lynxjs-Snippets.tsx/blob/main/ARCHITECTURE.md) to understand:

- How the snippet system works across multiple editors
- The dynamic management and auto-synchronization system
- File organization and snippet structure
- Multi-editor support architecture
- Lynxjs framework integration principles

This will help you make more effective contributions and understand where your changes fit in the bigger picture.

## Getting Started 🚀

### Prerequisites

- **VS Code** (primary development environment)
- **Git** for version control
- **Lynxjs knowledge** recommended for creating framework-specific snippets
- **Multiple editors** for testing cross-editor compatibility

### Setting Up Your Development Environment

1. **Fork the repository**: Click the "Fork" button on the [Lynxjs Snippets repository](https://github.com/bastndev/Lynxjs-Snippets.tsx)

2. **Clone your fork**:

```bash
git clone https://github.com/YOUR-USERNAME/Lynxjs-Snippets.tsx.git
cd Lynxjs-Snippets.tsx
```

3. **Switch to the dev branch**:

```bash
git checkout dev
```

4. **Open in VS Code**:

```bash
code .
```

## Development Workflow 🛠️

### Testing Your Changes

- **Press `F5`** to launch a new VS Code window with your snippets loaded
- **Alternative**: If you have the "Lynxjs Snippets" extension installed, use Command Palette → "Lynxjs: Manage Snippets"
- **Test across editors**: Verify snippets work in VS Code, Cursor, Windsurf, etc.
- **Test file types**: Ensure compatibility with .tsx and .jsx files

### Making Changes

1. **Create your changes** in the `dev` branch
2. **Test thoroughly** across multiple editors and file types
3. **Commit your changes** with descriptive messages
4. **Push to your fork**:

```bash
git push origin dev
```

## Types of Contributions 📝

### 1. Adding Support for New Editors

**Currently supported**: VS Code • Cursor • Windsurf • Trae.ai • Kiro • Firebase Studio

**To add a new editor**:

**Files to modify**:

- `package.json` - Add new snippet configurations for the editor
- `src/extension.js` - Configure editor detection and management
- `snippets/snippets.code-snippets` - Ensure snippet compatibility

**Example process**:

1. Research the new editor's snippet system
2. Map Lynxjs snippets to editor-specific format
3. Add dynamic management support if the editor supports it
4. Test snippet functionality and management commands
5. Update documentation

### 2. Creating New Lynxjs Snippets

**Current snippet categories**:

- **Import Snippets** (lho, lcss, lscs, lcomp/lcp, lii)
- **Component Snippets** (lv, lt, limg, ll, lll)
- **Function Snippets** (lex, lexx, arr, ltem)
- **Experimental Snippets** (lmain, lal, xx)

**New snippet areas**:

- Advanced Lynxjs components
- State management patterns
- Navigation structures
- Animation and styling helpers
- Testing utilities

### 3. Improving Existing Snippets

You can enhance any of our current snippet categories:

- **Import Snippets** (`lho`, `lcss`, `lscs`, `lcomp/lcp`, `lii`)
- **Component Snippets** (`lv`, `lt`, `limg`, `ll`, `lll`)
- **Function Snippets** (`lex`, `lexx`, `arr`, `ltem`)
- **Experimental Snippets** (`lmain`, `lal`, `xx`)

### 4. Enhancing Dynamic Management

**Management system improvements**:

- Better snippet organization
- Enhanced auto-synchronization
- New management commands
- Cross-editor compatibility
- Smart snippet suggestions

### 5. Documentation Improvements

We welcome improvements to:

- **README.md** - Main project documentation
- **CONTRIBUTING.md** - This guide
- **ARCHITECTURE.md** - Technical architecture documentation
- **CHANGELOG.md** - Version history
- Code comments and inline documentation

## Project Structure Deep Dive 📁

```
lynx-js-snippets/
├── src/
│   └── extension.js              # 🎯 MAIN CONTRIBUTION AREA
│                                 # Main entry point & all logic
├── snippets/
│   └── snippets.code-snippets    # 🎯 SNIPPET DEFINITIONS
│                                 # Original snippet templates
├── assets/
│   ├── icon.png                  # Extension icon
│   └── gif/
│       └── snippet-preview.gif   # Demo animation
├── package.json                  # 🎯 EXTENSION CONFIGURATION
└── README.md                     # Documentation
```

### Key Files for Contributors

**`snippets/snippets.code-snippets`** - Main snippet definitions:

- Add new Lynxjs snippet patterns
- Configure snippet prefixes and shortcuts
- Define tab stops and placeholders

**`src/extension.js`** - Extension logic:

- Snippet management system
- File watcher and auto-sync
- Command registry and handling
- Cross-editor compatibility

**`package.json`** - Extension configuration:

- Command definitions
- Activation events
- Editor compatibility settings

## Submitting Your Contribution 🎯

### Pull Request Requirements

When creating your PR, please include:

1. **Clear description** of what you've added/changed

2. **Snippet information** (if adding new snippets):

   - Snippet name and prefix
   - Lynxjs framework compatibility
   - Usage examples
   - Testing results

3. **Editor compatibility** (if adding editor support):

   - Editor name and version
   - Specific features implemented
   - Management system integration
   - Compatibility notes

4. **Screenshots/Videos** (highly recommended):
   - Show snippets in action across different editors
   - Demonstrate Lynxjs framework integration
   - Include workflow examples

### Testing Checklist

Before submitting, please test with:

**Functionality:**

- ✅ **Import snippets** (lho, lcss, lscs, lcomp/lcp, lii)
- ✅ **Component snippets** (lv, lt, limg, ll, lll)
- ✅ **Function snippets** (lex, lexx, arr, ltem)
- ✅ **Experimental snippets** (lmain, lal, xx)
- ✅ **Management commands** (create, edit, reset, delete)

**File types:**

- ✅ **.tsx files** - TypeScript React
- ✅ **.jsx files** - JavaScript React
- ✅ **Lynxjs syntax** compatibility
- ✅ **Tab stops and placeholders**

## Important Notes ⚠️

### What You CAN Modify

**Snippet file modifications**:

- ✅ Add new Lynxjs snippet patterns
- ✅ Improve existing snippet structures
- ✅ Extend snippet categories
- ✅ Add new management commands

**Guidelines**:

- Follow existing snippet structure
- Use appropriate Lynxjs framework syntax
- Include meaningful tab stops ($1, $2, etc.)
- Test for conflicts with existing snippets

### Code Formatting

The project maintains specific formatting for snippet files. Your changes should respect the existing structure and spacing patterns shown in the current files.

### Branch Strategy

- **Work in**: `dev` branch only
- **Submit PRs to**: `dev` branch
- The maintainer will merge `dev` → `main` for releases

## Naming Conventions 📝

**No strict patterns required**, but for consistency:

**New snippet files**: Descriptive names like:

- `[category]-snippets.code-snippets`
- `[framework-feature]-patterns.code-snippets`
- `[editor-name]-compatibility.code-snippets`

**Commands in package.json**: Follow existing pattern:

- `lynx-js-snippets.[functionName]`
- Example: `lynx-js-snippets.createSnippet`

## Multi-Editor Integration Guide 🌐

When adding support for a new editor:

### 1. Research Phase

- Study the editor's snippet system
- Identify dynamic management capabilities
- Map equivalent functions to existing Lynxjs snippets

### 2. Implementation Phase

- Add snippet configurations to appropriate files
- Update `src/extension.js` for editor detection
- Modify management system for command execution
- Set appropriate compatibility in package.json

### 3. Testing Phase

- Verify all snippet categories work
- Test dynamic management functionality
- Confirm Lynxjs framework compatibility
- Check cross-editor consistency

## Getting Help 🆘

- **Bugs or issues?** Create an [Issue](https://github.com/bastndev/Lynxjs-Snippets.tsx/issues)
- **Architecture questions?** Check the [Architecture documentation](https://github.com/bastndev/Lynxjs-Snippets.tsx/blob/main/ARCHITECTURE.md)
- **Need inspiration?** Study existing snippets in `snippets/snippets.code-snippets`

## Code of Conduct 📋

Please read and follow our [Code of Conduct](https://github.com/bastndev/Lynxjs-Snippets.tsx/blob/main/CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

---

**Thank you for contributing to Lynxjs Snippets!** Your work helps developers worldwide have a consistent, efficient Lynxjs development experience across all editors and platforms. �
