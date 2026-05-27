# Setting Up the Plugin Registry

This guide covers how to set up and manage the VAISH plugin registry for production.

## Overview

The plugin registry is a JSON file that lists all available plugins in the marketplace. Users browse and install plugins from this list.

**Submission Flow:**
1. Developer creates a plugin and publishes to npm
2. Developer submits PR to registry repo
3. Maintainers review and merge
4. Plugin appears in marketplace automatically

## Creating the Registry Repository

### 1. Create a New GitHub Repository

Create a new public repository called `registry` (or `vaish-plugin-registry`):

```
https://github.com/YOUR_USERNAME/registry
```

### 2. Create plugins.json

Create `plugins.json` in the repository root:

```json
{
  "plugins": [
    {
      "name": "vaish-plugin-economy",
      "displayName": "Economy System",
      "description": "Complete economy system with coins, work commands, shop, and leaderboards",
      "author": "VAISH",
      "version": "1.0.0",
      "category": "features",
      "permissions": ["db.read", "db.write", "commands.register"],
      "requiresRestart": false,
      "verified": true,
      "npmPackage": "vaish-plugin-economy"
    },
    {
      "name": "vaish-plugin-moderation",
      "displayName": "Advanced Moderation",
      "description": "Auto-mod, logs, slowmode, and advanced moderation tools",
      "author": "VAISH",
      "version": "1.0.0",
      "category": "moderation",
      "permissions": ["db.read", "db.write", "commands.register"],
      "requiresRestart": false,
      "verified": true,
      "npmPackage": "vaish-plugin-moderation"
    }
  ]
}
```

### 3. Plugin Entry Reference

Each plugin entry supports these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Internal name (npm package name) |
| `displayName` | string | Yes | Human-readable name |
| `description` | string | Yes | What the plugin does |
| `author` | string | Yes | Developer name |
| `version` | string | Yes | Current version |
| `category` | string | Yes | Category (see below) |
| `permissions` | array | No | Required permissions |
| `requiresRestart` | boolean | No | Needs bot restart to apply |
| `verified` | boolean | No | Official/audited plugin |
| `npmPackage` | string | Yes | Exact npm package name |
| `port` | number | No | Dashboard port if applicable |
| `configSchema` | object | No | Settings schema |

### 4. Categories

Use these category IDs:

| ID | Display Name |
|----|--------------|
| `features` | Features |
| `moderation` | Moderation |
| `entertainment` | Entertainment |
| `utility` | Utility |
| `analytics` | Analytics |

### 5. README (Optional)

Create a `README.md` explaining the submission process:

```markdown
# VAISH Plugin Registry

This repository contains the official list of VAISH plugins.

## Adding a Plugin

1. Publish your plugin to npm (must start with `vaish-plugin-`)
2. Fork this repository
3. Add your plugin to `plugins.json`
4. Submit a PR

## Plugin Requirements

- Must have a valid `plugin.json` manifest
- Must be published to npm
- Must not break the bot
- Must follow VAISH conventions

## Review Process

PRs are reviewed within 5 business days. We check for:
- Valid plugin.json
- Working npm package
- No security issues
- Proper Discord.py/discord.js usage
```

## Configuring VAISH

### Set the Registry URL

In your bot's environment:

```bash
# For GitHub raw URL
export PLUGIN_REGISTRY_URL="https://raw.githubusercontent.com/YOUR_USERNAME/registry/main/plugins.json"

# For custom server
export PLUGIN_REGISTRY_URL="https://your-server.com/plugins.json"
```

### Default URL

If not set, defaults to:
```
https://raw.githubusercontent.com/vaish-plugin-registry/registry/main/plugins.json
```

## Managing Submissions

### Review Checklist

When reviewing a PR, verify:

- [ ] Plugin has valid `plugin.json`
- [ ] npm package exists and is accessible
- [ ] Version matches package.json
- [ ] Description is accurate
- [ ] Category is appropriate
- [ ] No malicious code
- [ ] Plugin loads without errors

### Merging a Plugin

```bash
# Clone the repo
git clone https://github.com/vaish-plugin-registry/registry.git
cd registry

# Add the new plugin entry to plugins.json
# (use a text editor or jq)

# Commit and push
git add plugins.json
git commit -m "Add vaish-plugin-example"
git push origin main
```

### Using jq (Optional)

```bash
# Add a new plugin
jq '.plugins += [{
  "name": "vaish-plugin-example",
  "displayName": "Example Plugin",
  "description": "An example plugin",
  "author": "ExampleAuthor",
  "version": "1.0.0",
  "category": "features",
  "requiresRestart": false,
  "verified": false,
  "npmPackage": "vaish-plugin-example"
}]' plugins.json > temp.json && mv temp.json plugins.json
```

## Production Best Practices

### Cache Management

The bot caches the registry for 30 minutes. To force refresh:

1. Restart the bot, or
2. The bot will fetch automatically on next request after cache expires

### Health Checks

Monitor your registry:

```bash
# Test URL accessibility
curl -I https://raw.githubusercontent.com/YOUR_USERNAME/registry/main/plugins.json

# Validate JSON
curl -s https://raw.githubusercontent.com/YOUR_USERNAME/registry/main/plugins.json | jq .
```

### Backup

Keep a backup of `plugins.json` - it's your source of truth.

## Troubleshooting

### Plugin not appearing

- Check the JSON is valid: `jq . plugins.json`
- Verify the npm package exists
- Ensure `npmPackage` matches exactly
- Wait for cache to expire (30 min) or restart bot

### Invalid JSON

```bash
# Find syntax errors
jq plugins.json
```

### Registry URL not working

- Must be HTTPS
- Must return valid JSON
- Raw GitHub URL format: `https://raw.githubusercontent.com/USER/REPO/BRANCH/FILE`

## Example Registry

See [vaish-plugin-registry/registry](https://github.com/vaish-plugin-registry/registry) for a complete example.

## Need Help?

- Issues: Open an issue on the registry repo
- Discord: [VAISH Support](https://discord.gg/vaish)