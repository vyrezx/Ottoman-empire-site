import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';

const root=resolve('dist');
const assets=join(root,'assets');
const output=resolve(process.argv[2]??'Ottoman_Atlas.html');
const mimetypes={'.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
const files=readdirSync(assets);
let html=readFileSync(join(root,'index.html'),'utf8');
const inlineAssets=text=>{
 for(const file of files){
  const extension=file.slice(file.lastIndexOf('.'));
  const mimetype=mimetypes[extension];
  if(!mimetype||!text.includes('/assets/'+file))continue;
  const data=readFileSync(join(assets,file)).toString('base64');
  text=text.replaceAll('/assets/'+file,`data:${mimetype};base64,${data}`);
 }
 return text;
};
for(const file of files){
 if(file.endsWith('.js')){
  const js=inlineAssets(readFileSync(join(assets,file),'utf8')).replace(/<\/script/gi,'<\\/script');
  html=html.replace(/<script type="module" crossorigin src="[^"]+"><\/script>/,()=>`<script type="module">\n${js}\n</script>`);
 }
 if(file.endsWith('.css')){
  const css=inlineAssets(readFileSync(join(assets,file),'utf8'));
  html=html.replace(/<link rel="stylesheet" crossorigin href="[^"]+">/,()=>`<style>\n${css}\n</style>`);
 }
}
const favicon=files.find(file=>file.startsWith('favicon-'));
if(favicon)html=html.replace('/assets/'+favicon,'data:image/svg+xml;base64,'+readFileSync(join(assets,favicon)).toString('base64'));
writeFileSync(output,html);
