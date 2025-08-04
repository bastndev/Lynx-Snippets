// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * Extension activation function
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "lynx-js-snippets" is now active!'
  );

  // Initialize paths
  const paths = initializePaths(context);

  // Setup user snippets directory
  setupUserSnippetsDirectory(paths.userSnippetsPath);

  // Copy original snippets to user directory
  copySnippetsIfNeeded(paths.extensionSnippetsPath, paths.userSnippetsPath);

  // Register all commands
  registerCommands(context, paths);

  // Setup file watcher for automatic synchronization
  setupFileWatcher(context, paths.userSnippetsPath);
}

/**
 * Initialize and return extension paths
 * @param {vscode.ExtensionContext} context
 * @returns {Object} Object containing extension and user snippets paths
 */
function initializePaths(context) {
  return {
    extensionSnippetsPath: path.join(context.extensionPath, "snippets"),
    userSnippetsPath: path.join(context.globalStorageUri.fsPath, "snippets"),
  };
}

/**
 * Setup user snippets directory if it doesn't exist
 * @param {string} userSnippetsPath - Path to user snippets directory
 */
function setupUserSnippetsDirectory(userSnippetsPath) {
  if (!fs.existsSync(userSnippetsPath)) {
    fs.mkdirSync(userSnippetsPath, { recursive: true });
    console.log("Created user snippets directory:", userSnippetsPath);
  }
}

/**
 * Register all extension commands
 * @param {vscode.ExtensionContext} context
 * @param {Object} paths - Object containing extension paths
 */
function registerCommands(context, paths) {
  const commands = [
    {
      id: "lynx-js-snippets.manage",
      handler: () => showSnippetsManager(context, paths),
    },
    {
      id: "lynx-js-snippets.openSnippet",
      handler: (snippetPath) => openSnippetFile(snippetPath),
    },
    {
      id: "lynx-js-snippets.resetSnippet",
      handler: (snippetPath, originalPath) =>
        resetSnippet(snippetPath, originalPath),
    },
    {
      id: "lynx-js-snippets.createSnippet",
      handler: () => createNewSnippet(paths.userSnippetsPath),
    },
    {
      id: "lynx-js-snippets.deleteSnippet",
      handler: (snippetPath) => deleteSnippet(snippetPath),
    },
    {
      id: "lynx-js-snippets.refreshSnippets",
      handler: () => refreshSnippets(),
    },
  ];

  // Register each command
  commands.forEach((cmd) => {
    const disposable = vscode.commands.registerCommand(cmd.id, cmd.handler);
    context.subscriptions.push(disposable);
  });
}

/**
 * Copy snippets from extension to user directory if they don't exist
 * @param {string} sourcePath - Path to extension snippets
 * @param {string} targetPath - Path to user snippets
 */
function copySnippetsIfNeeded(sourcePath, targetPath) {
  try {
    if (!fs.existsSync(sourcePath)) {
      console.warn("Extension snippets directory not found:", sourcePath);
      return;
    }

    const files = fs.readdirSync(sourcePath);
    let copiedCount = 0;

    for (const file of files) {
      if (copySnippetFile(sourcePath, targetPath, file)) {
        copiedCount++;
      }
    }

    if (copiedCount > 0) {
      console.log(`Successfully copied ${copiedCount} snippet files`);
    }
  } catch (error) {
    handleError("Error copying snippets", error);
  }
}

/**
 * Copy individual snippet file
 * @param {string} sourcePath - Source directory path
 * @param {string} targetPath - Target directory path
 * @param {string} fileName - Name of file to copy
 * @returns {boolean} True if file was copied, false otherwise
 */
function copySnippetFile(sourcePath, targetPath, fileName) {
  const sourceFilePath = path.join(sourcePath, fileName);
  const targetFilePath = path.join(targetPath, fileName);

  // Skip if not a file or if target already exists
  if (!fs.statSync(sourceFilePath).isFile() || fs.existsSync(targetFilePath)) {
    return false;
  }

  try {
    fs.copyFileSync(sourceFilePath, targetFilePath);
    console.log(`Copied snippet: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`Failed to copy ${fileName}:`, error);
    return false;
  }
}

/**
 * Show the main snippets manager interface
 * @param {vscode.ExtensionContext} context - Extension context
 * @param {Object} paths - Object containing extension paths
 */
function showSnippetsManager(context, paths) {
  try {
    const snippetFiles = getSnippetFiles(paths);

    if (snippetFiles.length === 0) {
      vscode.window.showInformationMessage(
        "No snippet files found. Make sure your extension has snippet files."
      );
      return;
    }

    const quickPickItems = createQuickPickItems(snippetFiles);
    showSnippetFilePicker(quickPickItems);
  } catch (error) {
    handleError("Error showing snippets manager", error);
  }
}

/**
 * Get all available snippet files
 * @param {Object} paths - Object containing extension paths
 * @returns {Array} Array of snippet file objects
 */
function getSnippetFiles(paths) {
  try {
    return fs
      .readdirSync(paths.userSnippetsPath)
      .filter((file) => file.endsWith(".code-snippets"))
      .map((file) => createSnippetFileObject(file, paths));
  } catch (error) {
    console.error("Error reading user snippets directory:", error);
    return [];
  }
}

/**
 * Create snippet file object with metadata
 * @param {string} fileName - Name of the snippet file
 * @param {Object} paths - Object containing extension paths
 * @returns {Object} Snippet file object with metadata
 */
function createSnippetFileObject(fileName, paths) {
  return {
    name: fileName,
    path: path.join(paths.userSnippetsPath, fileName),
    originalPath: path.join(paths.extensionSnippetsPath, fileName),
    hasOriginal: fs.existsSync(
      path.join(paths.extensionSnippetsPath, fileName)
    ),
  };
}

/**
 * Create QuickPick items for snippet files
 * @param {Array} snippetFiles - Array of snippet file objects
 * @returns {Array} Array of QuickPick items
 */
function createQuickPickItems(snippetFiles) {
  const fileItems = snippetFiles.map((file) => ({
    label: `📄 ${file.name}`,
    description: "Lynxjs Snippet file",
    detail: file.hasOriginal ? "Can be reset to original" : "Custom file",
    file: file,
  }));

  // Add option to create new snippet
  fileItems.push({
    label: "➕ Create New Snippet",
    description: "Create a new snippet file",
    detail: "Add custom snippets for any language",
    isCreateNew: true,
  });

  return fileItems;
}

/**
 * Show snippet file picker interface
 * @param {Array} quickPickItems - Array of QuickPick items
 */
function showSnippetFilePicker(quickPickItems) {
  vscode.window
    .showQuickPick(quickPickItems, {
      placeHolder: "Select a snippet file to manage",
      matchOnDescription: true,
      matchOnDetail: true,
    })
    .then((selected) => {
      if (!selected) {
        return;
      }

      if (selected.isCreateNew) {
        vscode.commands.executeCommand("lynx-js-snippets.createSnippet");
        return;
      }

      showSnippetActions(selected.file);
    });
}

/**
 * Show available actions for a selected snippet file
 * @param {Object} file - Snippet file object with metadata
 */
function showSnippetActions(file) {
  const actions = createActionItems(file);

  vscode.window
    .showQuickPick(actions, {
      placeHolder: `Choose an action for ${file.name}`,
    })
    .then((action) => {
      if (action && action.command) {
        vscode.commands.executeCommand(action.command, ...action.args);
      }
    });
}

/**
 * Create action items for snippet file management
 * @param {Object} file - Snippet file object
 * @returns {Array} Array of action items
 */
function createActionItems(file) {
  const actions = [
    {
      label: "✏️ Open & Edit",
      description: "Open file for editing",
      command: "lynx-js-snippets.openSnippet",
      args: [file.path],
    },
    {
      label: "🔄 Refresh Snippets",
      description: "Reload snippets in VS Code",
      command: "lynx-js-snippets.refreshSnippets",
      args: [],
    },
  ];

  // Add reset option if original exists
  if (file.hasOriginal) {
    actions.push({
      label: "♻️ Reset to Original",
      description: "Restore to extension default",
      command: "lynx-js-snippets.resetSnippet",
      args: [file.path, file.originalPath],
    });
  }

  // Add delete option for custom files (files without original)
  if (!file.hasOriginal) {
    actions.push({
      label: "🗑️ Delete",
      description: "Delete this custom snippet file",
      command: "lynx-js-snippets.deleteSnippet",
      args: [file.path],
    });
  }

  return actions;
}

/**
 * Open a snippet file in the editor
 * @param {string} snippetPath - Path to the snippet file
 */
function openSnippetFile(snippetPath) {
  vscode.workspace
    .openTextDocument(snippetPath)
    .then((doc) => {
      vscode.window.showTextDocument(doc);
    })
    .catch((error) => {
      handleError("Failed to open snippet file", error);
    });
}

/**
 * Reset a snippet file to its original state
 * @param {string} snippetPath - Path to user snippet file
 * @param {string} originalPath - Path to original snippet file
 */
function resetSnippet(snippetPath, originalPath) {
  try {
    if (!validateResetOperation(snippetPath, originalPath)) {
      return;
    }

    showResetConfirmation(snippetPath, originalPath);
  } catch (error) {
    handleError("Error resetting snippet", error);
  }
}

/**
 * Validate reset operation prerequisites
 * @param {string} snippetPath - Path to user snippet file
 * @param {string} originalPath - Path to original snippet file
 * @returns {boolean} True if operation can proceed
 */
function validateResetOperation(snippetPath, originalPath) {
  if (!fs.existsSync(originalPath)) {
    vscode.window.showErrorMessage(
      `Original snippet file not found: ${path.basename(originalPath)}`
    );
    return false;
  }
  return true;
}

/**
 * Show confirmation dialog for reset operation
 * @param {string} snippetPath - Path to user snippet file
 * @param {string} originalPath - Path to original snippet file
 */
function showResetConfirmation(snippetPath, originalPath) {
  const fileName = path.basename(snippetPath);

  vscode.window
    .showWarningMessage(
      `Are you sure you want to reset "${fileName}" to its original state? This will overwrite your changes.`,
      { modal: true },
      "Reset",
      "Cancel"
    )
    .then((selection) => {
      if (selection === "Reset") {
        performReset(snippetPath, originalPath);
      }
    });
}

/**
 * Perform the actual reset operation
 * @param {string} snippetPath - Path to user snippet file
 * @param {string} originalPath - Path to original snippet file
 */
function performReset(snippetPath, originalPath) {
  try {
    fs.copyFileSync(originalPath, snippetPath);

    const fileName = path.basename(snippetPath);
    vscode.window.showInformationMessage(
      `Successfully reset "${fileName}" to original state!`
    );

    // Open the reset file
    openSnippetFile(snippetPath);
  } catch (error) {
    handleError("Failed to reset snippet file", error);
  }
}

/**
 * Centralized error handling
 * @param {string} message - Error message to display
 * @param {Error} error - The error object
 */
function handleError(message, error) {
  console.error(message, error);
  vscode.window.showErrorMessage(`${message}: ${error.message}`);
}

/**
 * Extension deactivation function
 */
function deactivate() {
  console.log("Lynxjs Snippets extension deactivated");
}
// ============================================================================
// FUNCTION 3: FLEXIBILITY - Create new snippets
// ============================================================================

/**
 * Create a new snippet file from scratch
 * @param {string} userSnippetsPath - Path to user snippets directory
 */
function createNewSnippet(userSnippetsPath) {
  // Ask for language/file name
  vscode.window
    .showInputBox({
      placeHolder:
        "Enter language or file name (e.g., javascript, vue, custom)",
      prompt: "Enter the language for the new snippet file",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Please enter a valid name";
        }
        const trimmed = value.trim();
        if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) {
          return "Name can only contain letters, numbers, hyphens, and underscores";
        }
        if (trimmed.length > 50) {
          return "Name must be 50 characters or less";
        }
        if (trimmed.startsWith('-') || trimmed.startsWith('_')) {
          return "Name cannot start with hyphen or underscore";
        }
        return null;
      },
    })
    .then((language) => {
      if (!language) {
        return;
      }

      createSnippetFile(userSnippetsPath, language.trim());
    });
}

/**
 * Create the actual snippet file with template
 * @param {string} userSnippetsPath - Path to user snippets directory
 * @param {string} language - Language name for the snippet file
 */
function createSnippetFile(userSnippetsPath, language) {
  const fileName = `${language}.code-snippets`;
  const filePath = path.join(userSnippetsPath, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    vscode.window.showErrorMessage(
      `Snippet file for "${language}" already exists!`
    );
    return;
  }

  try {
    // Ensure directory exists
    if (!fs.existsSync(userSnippetsPath)) {
      fs.mkdirSync(userSnippetsPath, { recursive: true });
    }

    // Create template snippet
    const template = createSnippetTemplate(language);

    // Write file with proper formatting
    const jsonContent = JSON.stringify(template, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');

    vscode.window.showInformationMessage(
      `Created new snippet file: ${fileName}`
    );

    // Open the new file
    openSnippetFile(filePath);
  } catch (error) {
    handleError("Failed to create snippet file", error);
  }
}

/**
 * Create a template snippet structure
 * @param {string} language - Language name
 * @returns {Object} Template snippet object
 */
function createSnippetTemplate(language) {
  return {
    [`example-${language}-snippet`]: {
      prefix: `ex-${language}`,
      scope: language === 'global' ? '' : language,
      description: `Example ${language} snippet - Edit this to create your own`,
      body: [
        "// Your snippet content here",
        "// Use $1, $2, etc. for tab stops",
        "// Use ${1:default} for placeholders with default values",
        "// Use $0 for final cursor position",
        "${1:content}$0",
      ],
    },
    [`${language}-template`]: {
      prefix: `${language}-temp`,
      scope: language === 'global' ? '' : language,
      description: `${language} template with multiple placeholders`,
      body: [
        "${1:// Start typing here}",
        "",
        "${2:// Add more content}",
        "",
        "${3:// Final section}$0",
      ],
    },
  };
}

// ============================================================================
// FUNCTION 4: SYNCHRONIZATION - File watcher for automatic changes detection
// ============================================================================

/**
 * Setup file watcher to monitor snippet changes
 * @param {vscode.ExtensionContext} context - Extension context
 * @param {string} snippetsPath - Path to snippets directory
 */
function setupFileWatcher(context, snippetsPath) {
  try {
    // Check if directory exists before watching
    if (!fs.existsSync(snippetsPath)) {
      console.warn("Snippets directory doesn't exist, skipping file watcher setup");
      return;
    }

    const watcher = fs.watch(
      snippetsPath,
      { recursive: true },
      (eventType, filename) => {
        if (filename && filename.endsWith(".code-snippets")) {
          handleSnippetFileChange(filename);
        }
      }
    );

    // Handle watcher errors
    watcher.on('error', (error) => {
      console.error("File watcher error:", error);
    });

    // Dispose watcher when extension is deactivated
    context.subscriptions.push({
      dispose: () => {
        try {
          watcher.close();
          console.log("File watcher disposed");
        } catch (error) {
          console.error("Error disposing file watcher:", error);
        }
      },
    });

    console.log("File watcher setup successfully");
  } catch (error) {
    console.error("Error setting up file watcher:", error);
    // Don't show error to user as this is not critical functionality
  }
}

/**
 * Handle snippet file changes
 * @param {string} filename - Name of the changed file
 */
function handleSnippetFileChange(filename) {
  // Debounce rapid changes
  clearTimeout(handleSnippetFileChange.timeout);
  handleSnippetFileChange.timeout = setTimeout(() => {
    showSnippetChangeNotification(filename);
  }, 1000);
}

/**
 * Show notification when snippet file changes
 * @param {string} filename - Name of the changed file
 */
function showSnippetChangeNotification(filename) {
  const message = `Snippet file "${filename}" has been modified. Reload to apply changes?`;

  vscode.window
    .showInformationMessage(message, "Reload", "Later")
    .then((selection) => {
      if (selection === "Reload") {
        refreshSnippets();
      }
    });
}

/**
 * Refresh snippets by reloading the extension host (less disruptive than full window reload)
 */
function refreshSnippets() {
  vscode.window.showInformationMessage("Refreshing snippets...");

  // Try to reload just the extension host first (less disruptive)
  vscode.commands.executeCommand("workbench.action.restartExtensionHost")
    .then(() => {
      // If successful, show success message after a delay
      setTimeout(() => {
        vscode.window.showInformationMessage("Snippets refreshed successfully!");
      }, 1000);
    })
    .catch(() => {
      // Fallback to full window reload if extension host restart fails
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    });
}

// ============================================================================
// FUNCTION 5: SECURITY - Delete custom snippet files
// ============================================================================

/**
 * Delete a custom snippet file (with confirmation)
 * @param {string} snippetPath - Path to the snippet file to delete
 */
function deleteSnippet(snippetPath) {
  const fileName = path.basename(snippetPath);

  // Show confirmation dialog
  vscode.window
    .showWarningMessage(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
      { modal: true },
      "Delete",
      "Cancel"
    )
    .then((selection) => {
      if (selection === "Delete") {
        performSnippetDeletion(snippetPath);
      }
    });
}

/**
 * Perform the actual snippet file deletion
 * @param {string} snippetPath - Path to the snippet file
 */
function performSnippetDeletion(snippetPath) {
  try {
    // Verify file exists
    if (!fs.existsSync(snippetPath)) {
      vscode.window.showErrorMessage("Snippet file not found!");
      return;
    }

    // Delete the file
    fs.unlinkSync(snippetPath);

    const fileName = path.basename(snippetPath);
    vscode.window.showInformationMessage(`Successfully deleted "${fileName}"!`);

    console.log(`Deleted snippet file: ${fileName}`);
  } catch (error) {
    handleError("Failed to delete snippet file", error);
  }
}

// Export functions for VS Code extension system
module.exports = {
  activate,
  deactivate,
};
