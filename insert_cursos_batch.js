var fs = require('fs'), 
    es = require('event-stream');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'suasenha',
    database : 'censosuperior'
});

connection.connect();

var lineNumber = 0; //contador do número da linha do arquivo
const BATCH_SIZE = 1000 //tamanho do lote que será inserido no MySQL a cada insert

var startTime = new Date().getTime() //marca o tempo inicial da execução
var endTime = 0 //marca o tempo final da execução

var sqlValues = "" //concatena os valores que serão inseridos em lote no MySQL
var sqlPrefix = "insert into cursos(NU_ANO_CENSO,CO_IES,TP_CATEGORIA_ADMINISTRATIVA,TP_ORGANIZACAO_ACADEMICA,CO_LOCAL_OFERTA,CO_UF,CO_MUNICIPIO,IN_CAPITAL,CO_CURSO,NO_CURSO,TP_SITUACAO,CO_CINE_ROTULO,TP_GRAU_ACADEMICO,TP_MODALIDADE_ENSINO,TP_NIVEL_ACADEMICO,IN_GRATUITO,TP_ATRIBUTO_INGRESSO,NU_CARGA_HORARIA,DT_INICIO_FUNCIONAMENTO,DT_AUTORIZACAO_CURSO,IN_AJUDA_DEFICIENTE,IN_MATERIAL_DIGITAL,IN_MATERIAL_AMPLIADO,IN_MATERIAL_TATIL,IN_MATERIAL_IMPRESSO,IN_MATERIAL_AUDIO,IN_MATERIAL_BRAILLE,IN_MATERIAL_LIBRAS,IN_DISCIPLINA_LIBRAS,IN_TRADUTOR_LIBRAS,IN_GUIA_INTERPRETE,IN_RECURSOS_COMUNICACAO,IN_RECURSOS_INFORMATICA,IN_INTEGRAL,IN_MATUTINO,IN_VESPERTINO,IN_NOTURNO,NU_INTEGRALIZACAO_INTEGRAL,NU_INTEGRALIZACAO_MATUTINO,NU_INTEGRALIZACAO_VESPERTINO,NU_INTEGRALIZACAO_NOTURNO,NU_INTEGRALIZACAO_EAD,IN_OFERECE_DISC_SEMI_PRES,NU_PERC_CARGA_SEMI_PRES,IN_POSSUI_LABORATORIO,QT_INSC_VAGA_NOVA_INTEGRAL,QT_INSC_VAGA_NOVA_MATUTINO,QT_INSC_VAGA_NOVA_VESPERTINO,QT_INSC_VAGA_NOVA_NOTURNO,QT_INSC_VAGA_NOVA_EAD,QT_INSC_VAGA_REMAN_INTEGRAL,QT_INSC_VAGA_REMAN_MATUTINO,QT_INSC_VAGA_REMAN_VESPERTINO,QT_INSC_VAGA_REMAN_NOTURNO,QT_INSC_VAGA_REMAN_EAD,QT_INSC_PROG_ESP_INTEGRAL,QT_INSC_PROG_ESP_MATUTINO,QT_INSC_PROG_ESP_VESPERTINO,QT_INSC_PROG_ESP_NOTURNO,QT_INSC_PROG_ESP_EAD,QT_INSC_PRINCIPAL_INTEGRAL,QT_INSC_PRINCIPAL_MATUTINO,QT_INSC_PRINCIPAL_VESPERTINO,QT_INSC_PRINCIPAL_NOTURNO,QT_INSC_PRINCIPAL_EAD,QT_INSC_OUTRA_VAGA_INTEGRAL,QT_INSC_OUTRA_VAGA_MATUTINO,QT_INSC_OUTRA_VAGA_VESPERTINO,QT_INSC_OUTRA_VAGA_NOTURNO,QT_INSC_OUTRA_VAGA_EAD,QT_INSC_ANUAL_INTEGRAL,QT_INSC_ANUAL_MATUTINO,QT_INSC_ANUAL_VESPERTINO,QT_INSC_ANUAL_NOTURNO,QT_INSC_ANUAL_EAD,QT_VAGAS_NOVAS_INTEGRAL,QT_VAGAS_NOVAS_MATUTINO,QT_VAGAS_NOVAS_VESPERTINO,QT_VAGAS_NOVAS_NOTURNO,QT_VAGAS_NOVAS_EAD,QT_VAGAS_REMAN_INTEGRAL,QT_VAGAS_REMAN_MATUTINO,QT_VAGAS_REMAN_VESPERTINO,QT_VAGAS_REMAN_NOTURNO,QT_VAGAS_REMAN_EAD,QT_VAGAS_PROG_ESP_INTEGRAL,QT_VAGAS_PROG_ESP_MATUTINO,QT_VAGAS_PROG_ESP_VESPERTINO,QT_VAGAS_PROG_ESP_NOTURNO,QT_VAGAS_PROG_ESP_EAD,QT_VAGAS_PRINCIPAL_INTEGRAL,QT_VAGAS_PRINCIPAL_MATUTINO,QT_VAGAS_PRINCIPAL_VESPERTINO,QT_VAGAS_PRINCIPAL_NOTURNO,QT_VAGAS_PRINCIPAL_EAD,QT_VAGAS_OUTRAS_INTEGRAL,QT_VAGAS_OUTRAS_MATUTINO,QT_VAGAS_OUTRAS_VESPERTINO,QT_VAGAS_OUTRAS_NOTURNO,QT_VAGAS_OUTRAS_EAD,QT_VAGAS_ANUAL_INTEGRAL,QT_VAGAS_ANUAL_MATUTINO,QT_VAGAS_ANUAL_VESPERTINO,QT_VAGAS_ANUAL_NOTURNO,QT_VAGAS_ANUAL_EAD,QT_MATRICULA_TOTAL,QT_CONCLUINTE_TOTAL,QT_INGRESSO_TOTAL,QT_INGRESSO_VAGA_NOVA,QT_INGRESSO_PROCESSO_SELETIVO,QT_VAGA_TOTAL,QT_INSCRITO_TOTAL) values "
//inicializa a leitura do arquivo CSV como stream
var s = fs.createReadStream('./files/DM_CURSO.CSV')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){ //mapeia para cada linha do arquivo, uma a uma

        //pausa a leitura do arquivo até que o processamento da linha tenha terminado (s.resume())
        s.pause();

        if (line.trim() != ""){ //se a linha não for vazia
            if (lineNumber > 1){ //desconsidera também a primeira linha do arquivo, pois é um cabeçalho
                let values = line.split("|").join("','") //no arquivo DM_CURSO.CSV, os valores estão separados por |, então é necessário substituir por vírgula. As aspas simples são para inserir os valores como string.
                sqlValues += "('" + values + "')," //monta cada item e concatena na variável que guarda os dados de cada lote

                if (lineNumber % BATCH_SIZE == 0){ //cada vez que atinge o tamanho do lote definido inicialmente, faz o insert e zera a variável para um novo lote
                    sqlValues = sqlValues.substring(0, sqlValues.length - 1); //tira a vírgula do final do último conjunto de valores
                    connection.query(sqlPrefix + sqlValues, function (error, results, fields) { //executa o INSERT no MySQL
                        if (error) {
                            console.log(error)
                            throw error
                        };                        
                        lineNumber++ //incrementa a variável pois passará para a próxima linha
                        s.resume(); //volta a ler o arquivo, passando para a próxima linha
                    });
                    sqlValues = "" //zera a variável que guarda os dados do lote, para começar a concatenar um novo lote
                }else{
                    lineNumber++
                    s.resume();
                }            
            }else{
                lineNumber++
                s.resume();
            }
        }else{
            lineNumber++
            s.resume();
        }
    })
    .on('error', function(err){ //caso ocorra algum erro na leitura, emite uma mensagem de erro
        console.log('Error while reading file.', err);
        connection.end();
    })
    .on('end', function(){ //quando terminar de ler a última linha do arquivo, verifica se há dados no lote que ainda não foram inseridos.

        //se houver linhas restantes devido à inserção de BATCH_SIZE em BATCH_SIZE, insere no final
        if (sqlValues != ""){
            sqlValues = sqlValues.substring(0, sqlValues.length - 1); //tira a vírgula do final do último conjunto de valores
            connection.query(sqlPrefix + sqlValues, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    throw error
                };
                connection.end(); //finaliza a conexão com o MySQL
            });
        }else{ //se não houver linhas restantes
            connection.end(); //finaliza a conexão com o MySQL
        }
        endTime = new Date().getTime() //marca o timestamp final para fazer a diferença com o timestamp do início da execução
        console.log(endTime - startTime) //imprime, em milissegundos, a diferença entre o timestamp final e o inicial
    })
);