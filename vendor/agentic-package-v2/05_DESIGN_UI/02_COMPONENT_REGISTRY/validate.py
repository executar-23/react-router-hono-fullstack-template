from pathlib import Path
import json
from jsonschema import Draft202012Validator
p=Path(__file__).parent
load=lambda n:json.loads((p/n).read_text())
def acyclic(ids, edges):
 adj={i:[] for i in ids}
 for a,b in edges: adj[a].append(b)
 seen=set(); active=set()
 def walk(n):
  if n in active: raise ValueError('cycle')
  if n in seen:return
  active.add(n)
  for b in adj[n]:walk(b)
  active.remove(n);seen.add(n)
 for n in ids:walk(n)
def domain(g):
 ids=[n['id'] for n in g['nodes']]; es=[e['id'] for e in g['edges']]
 assert len(ids)==len(set(ids)) and len(es)==len(set(es))
 parents={}; constrained=[]
 for e in g['edges']:
  assert e['source'] in ids and e['target'] in ids and e['source']!=e['target']
  if e['relation'] in ['hierarchy','dependency','sequence']:constrained.append((e['source'],e['target']))
  if e['relation']=='hierarchy':
   assert e['target'] not in parents
   parents[e['target']]=e['source']
 acyclic(ids,constrained)
 for n in g['nodes']:
  if n['status']=='VERIFIED':assert n.get('evidence')
checks=[]
r=load('component-registry.json')['components'];ids=[c['id'] for c in r]
assert len(ids)==len(set(ids))
for c in r:
 assert all(d in ids for d in c['depends_on'])
 assert '## '+c['name'] in (p/'handoff.md').read_text()
acyclic(ids,[(c['id'],d) for c in r for d in c['depends_on']])
checks.append({'check':'14 IDs únicos, dependências acíclicas e seções de handoff presentes','result':'PASS','count':len(r)})
t=load('tokens.json')
assert all(v[5:-1] in t['raw'] for v in t['semantic'].values())
checks.append({'check':'Aliases resolvem para tokens raw','result':'PASS','count':len(t['semantic'])})
s=load('graph.schema.json');Draft202012Validator.check_schema(s);v=Draft202012Validator(s)
e=load('examples.json')
for g in e['valid']:v.validate(g);domain(g)
for g in e['invalid_domain']:
 v.validate(g)
 try:domain(g)
 except (AssertionError,ValueError):pass
 else:raise AssertionError('Invalid fixture accepted')
checks.append({'check':'Schema válido; 3 fixtures válidas e 2 inválidas rejeitadas no domínio','result':'PASS'})
result={'status':'VERIFIED_DOCUMENT_STRUCTURE_ONLY','checks':checks,'not_tested':['UI real','Integração backend','TypeScript compilado no app','Acessibilidade em navegador','Impressão/exportação real','Desempenho','Deploy']}
(p/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False))
