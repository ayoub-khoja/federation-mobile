#!/usr/bin/env node

/**
 * Script pour ajouter export const dynamic = 'force-dynamic'; à toutes les routes API
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function findApiRoutes(dir) {
  const routes = [];
  
  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        traverse(filePath);
      } else if (file === 'route.ts' || file === 'route.js') {
        routes.push(filePath);
      }
    }
  }
  
  traverse(dir);
  return routes;
}

function addDynamicExport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si le fichier contient déjà dynamic = 'force-dynamic'
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`${colors.yellow}⏭️  ${filePath} - Déjà configuré${colors.reset}`);
      return false;
    }
    
    // Vérifier si le fichier utilise request.headers.get
    if (!content.includes('request.headers.get')) {
      console.log(`${colors.blue}ℹ️  ${filePath} - Pas d'utilisation de headers${colors.reset}`);
      return false;
    }
    
    // Trouver la position après les imports
    const importLines = content.split('\n').filter(line => 
      line.trim().startsWith('import ') || 
      line.trim().startsWith('const ') && line.includes('require(') ||
      line.trim() === ''
    );
    
    let insertIndex = 0;
    for (let i = 0; i < content.split('\n').length; i++) {
      const line = content.split('\n')[i];
      if (line.trim().startsWith('import ') || 
          (line.trim().startsWith('const ') && line.includes('require('))) {
        insertIndex = i + 1;
      } else if (line.trim() !== '' && !line.trim().startsWith('//')) {
        break;
      }
    }
    
    // Insérer la ligne dynamic
    const lines = content.split('\n');
    lines.splice(insertIndex, 0, '', '// Force cette route à être dynamique', "export const dynamic = 'force-dynamic';");
    
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`${colors.green}✅ ${filePath} - Configuré${colors.reset}`);
    return true;
    
  } catch (error) {
    console.log(`${colors.red}❌ ${filePath} - Erreur: ${error.message}${colors.reset}`);
    return false;
  }
}

function main() {
  console.log(`${colors.blue}🔧 Correction des routes API pour Next.js${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`);
  
  const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
  
  if (!fs.existsSync(apiDir)) {
    console.log(`${colors.red}❌ Répertoire API non trouvé: ${apiDir}${colors.reset}`);
    process.exit(1);
  }
  
  const routes = findApiRoutes(apiDir);
  console.log(`${colors.blue}📁 ${routes.length} routes API trouvées${colors.reset}\n`);
  
  let modifiedCount = 0;
  
  for (const route of routes) {
    const relativePath = path.relative(process.cwd(), route);
    if (addDynamicExport(route)) {
      modifiedCount++;
    }
  }
  
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.green}✅ ${modifiedCount} routes modifiées${colors.reset}`);
  console.log(`${colors.blue}📊 ${routes.length} routes totales${colors.reset}`);
  
  if (modifiedCount > 0) {
    console.log(`\n${colors.yellow}💡 Les routes API sont maintenant configurées pour être dynamiques${colors.reset}`);
    console.log(`${colors.yellow}   Cela devrait résoudre les erreurs de build statique${colors.reset}`);
  }
}

main();
