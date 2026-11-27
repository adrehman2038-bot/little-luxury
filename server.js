// ShopFlow Connect backend: signs 2Checkout inline cart. Run: TCO_MERCHANT=xxx TCO_SECRET=xxx ALLOW_ORIGIN=https://yoursite.com node server.js
const http=require('http'),c=require('crypto');
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
http.createServer((req,res)=>{
 res.setHeader('Access-Control-Allow-Origin',process.env.ALLOW_ORIGIN||'*');res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
 if(req.method==='POST'&&req.url==='/api/signature'){
  const now=Math.floor(Date.now()/1000),h=b64({alg:'HS256',typ:'JWT'}),p=b64({sub:process.env.TCO_MERCHANT,iat:now,exp:now+3600,iss:'Avangate Merchant'});
  const sig=c.createHmac('sha256',process.env.TCO_SECRET).update(h+'.'+p).digest('base64url');
  res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({signature:`${h}.${p}.${sig}`}))}
 res.writeHead(404);res.end()}).listen(process.env.PORT||3000);
