# Como ler arquivos CSV grandes com Node.JS e inserir no MySQL?
Neste repositório, há um código de exemplo para ler grandes arquivos com Node.JS e inserir em lote no MySQL.
O código está em único arquivo para facilitar o entendimento e a adaptação para quem queira utilizar apenas parte dele.
O arquivo DM_CURSO.CSV contém todos os cursos de Ensino Superior do Brasil reportados no [Censo da Educação Superior 2018](http://inep.gov.br/microdados).

## Antes de executar:
Crie um banco de dados e a seguinte tabela no MySQL.

CREATE DATABASE censoinep;

CREATE TABLE `cursos` (
  `id` bigint(16) unsigned NOT NULL AUTO_INCREMENT,
  `NU_ANO_CENSO` varchar(80) DEFAULT NULL,
  `co_ies` int(11) DEFAULT NULL,
  `TP_CATEGORIA_ADMINISTRATIVA` varchar(80) DEFAULT NULL,
  `TP_ORGANIZACAO_ACADEMICA` varchar(80) DEFAULT NULL,
  `co_local_oferta` varchar(100) DEFAULT NULL,
  `co_uf` varchar(10) DEFAULT NULL,
  `co_municipio` varchar(100) DEFAULT NULL,
  `IN_CAPITAL` varchar(80) DEFAULT NULL,
  `co_curso` varchar(100) DEFAULT NULL,
  `NO_CURSO` varchar(255) DEFAULT NULL,
  `TP_SITUACAO` varchar(80) DEFAULT NULL,
  `CO_CINE_ROTULO` varchar(80) DEFAULT NULL,
  `TP_GRAU_ACADEMICO` varchar(80) DEFAULT NULL,
  `TP_MODALIDADE_ENSINO` varchar(80) DEFAULT NULL,
  `TP_NIVEL_ACADEMICO` varchar(80) DEFAULT NULL,
  `IN_GRATUITO` varchar(80) DEFAULT NULL,
  `TP_ATRIBUTO_INGRESSO` varchar(80) DEFAULT NULL,
  `NU_CARGA_HORARIA` varchar(80) DEFAULT NULL,
  `DT_INICIO_FUNCIONAMENTO` varchar(80) DEFAULT NULL,
  `DT_AUTORIZACAO_CURSO` varchar(80) DEFAULT NULL,
  `IN_AJUDA_DEFICIENTE` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_DIGITAL` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_AMPLIADO` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_TATIL` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_IMPRESSO` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_AUDIO` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_BRAILLE` varchar(80) DEFAULT NULL,
  `IN_MATERIAL_LIBRAS` varchar(80) DEFAULT NULL,
  `IN_DISCIPLINA_LIBRAS` varchar(80) DEFAULT NULL,
  `IN_TRADUTOR_LIBRAS` varchar(80) DEFAULT NULL,
  `IN_GUIA_INTERPRETE` varchar(80) DEFAULT NULL,
  `IN_RECURSOS_COMUNICACAO` varchar(80) DEFAULT NULL,
  `IN_RECURSOS_INFORMATICA` varchar(80) DEFAULT NULL,
  `IN_INTEGRAL` varchar(80) DEFAULT NULL,
  `IN_MATUTINO` varchar(80) DEFAULT NULL,
  `IN_VESPERTINO` varchar(80) DEFAULT NULL,
  `IN_NOTURNO` varchar(80) DEFAULT NULL,
  `NU_INTEGRALIZACAO_INTEGRAL` varchar(80) DEFAULT NULL,
  `NU_INTEGRALIZACAO_MATUTINO` varchar(80) DEFAULT NULL,
  `NU_INTEGRALIZACAO_VESPERTINO` varchar(80) DEFAULT NULL,
  `NU_INTEGRALIZACAO_NOTURNO` varchar(80) DEFAULT NULL,
  `NU_INTEGRALIZACAO_EAD` varchar(80) DEFAULT NULL,
  `IN_OFERECE_DISC_SEMI_PRES` varchar(80) DEFAULT NULL,
  `NU_PERC_CARGA_SEMI_PRES` varchar(80) DEFAULT NULL,
  `IN_POSSUI_LABORATORIO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_NOVA_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_NOVA_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_NOVA_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_NOVA_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_NOVA_EAD` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_REMAN_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_REMAN_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_REMAN_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_REMAN_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_VAGA_REMAN_EAD` varchar(80) DEFAULT NULL,
  `QT_INSC_PROG_ESP_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_PROG_ESP_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_PROG_ESP_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_PROG_ESP_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_PROG_ESP_EAD` varchar(80) DEFAULT NULL,
  `QT_INSC_PRINCIPAL_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_PRINCIPAL_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_PRINCIPAL_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_PRINCIPAL_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_PRINCIPAL_EAD` varchar(80) DEFAULT NULL,
  `QT_INSC_OUTRA_VAGA_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_OUTRA_VAGA_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_OUTRA_VAGA_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_OUTRA_VAGA_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_OUTRA_VAGA_EAD` varchar(80) DEFAULT NULL,
  `QT_INSC_ANUAL_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_INSC_ANUAL_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_ANUAL_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_INSC_ANUAL_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_INSC_ANUAL_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_NOVAS_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_NOVAS_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_NOVAS_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_NOVAS_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_NOVAS_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_REMAN_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_REMAN_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_REMAN_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_REMAN_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_REMAN_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PROG_ESP_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PROG_ESP_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PROG_ESP_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PROG_ESP_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PROG_ESP_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PRINCIPAL_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PRINCIPAL_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PRINCIPAL_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PRINCIPAL_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_PRINCIPAL_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_OUTRAS_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_OUTRAS_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_OUTRAS_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_OUTRAS_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_OUTRAS_EAD` varchar(80) DEFAULT NULL,
  `QT_VAGAS_ANUAL_INTEGRAL` varchar(80) DEFAULT NULL,
  `QT_VAGAS_ANUAL_MATUTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_ANUAL_VESPERTINO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_ANUAL_NOTURNO` varchar(80) DEFAULT NULL,
  `QT_VAGAS_ANUAL_EAD` varchar(80) DEFAULT NULL,
  `QT_MATRICULA_TOTAL` varchar(80) DEFAULT NULL,
  `QT_CONCLUINTE_TOTAL` varchar(80) DEFAULT NULL,
  `QT_INGRESSO_TOTAL` varchar(80) DEFAULT NULL,
  `QT_INGRESSO_VAGA_NOVA` varchar(80) DEFAULT NULL,
  `QT_INGRESSO_PROCESSO_SELETIVO` varchar(80) DEFAULT NULL,
  `QT_VAGA_TOTAL` varchar(80) DEFAULT NULL,
  `QT_INSCRITO_TOTAL` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=719593 DEFAULT CHARSET=latin1;

## Não se esqueça
É necessário alterar os dados de conexão com o banco de dados no início do arquivo **insert_cursos_batch.js**.

## Para executar
```
npm install
node insert_cursos_batch.js
```