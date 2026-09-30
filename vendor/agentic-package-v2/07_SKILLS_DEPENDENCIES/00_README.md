# Skill Dependencies — Readme

Esta pasta concentra o contrato de descoberta e a Skill `executar-prompt` usada para normalizar os handoffs.

Regra principal: a dependência de uma Skill é um dado de repositório/database, não uma hipótese do agente.

Fluxo: `Skill candidate → repository lookup → dependency extraction → validation → registry → workflow eligibility`.
