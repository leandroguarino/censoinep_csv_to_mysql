var fs = require('fs')
    , es = require('event-stream');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'guarino',
    database : 'censosuperior'
});

connection.connect();

var lineNumber = 0;
const BATCH_SIZE = 1500

var startTime = new Date().getTime()
var endTime = 0
console.log("Start: ",startTime)

var sqlValues = ""
var sqlPrefix = "insert into cursos(NU_ANO_CENSO,CO_IES,TP_CATEGORIA_ADMINISTRATIVA,TP_ORGANIZACAO_ACADEMICA,CO_LOCAL_OFERTA,CO_UF,CO_MUNICIPIO,IN_CAPITAL,CO_CURSO,NO_CURSO,TP_SITUACAO,CO_CINE_ROTULO,TP_GRAU_ACADEMICO,TP_MODALIDADE_ENSINO,TP_NIVEL_ACADEMICO,IN_GRATUITO,TP_ATRIBUTO_INGRESSO,NU_CARGA_HORARIA,DT_INICIO_FUNCIONAMENTO,DT_AUTORIZACAO_CURSO,IN_AJUDA_DEFICIENTE,IN_MATERIAL_DIGITAL,IN_MATERIAL_AMPLIADO,IN_MATERIAL_TATIL,IN_MATERIAL_IMPRESSO,IN_MATERIAL_AUDIO,IN_MATERIAL_BRAILLE,IN_MATERIAL_LIBRAS,IN_DISCIPLINA_LIBRAS,IN_TRADUTOR_LIBRAS,IN_GUIA_INTERPRETE,IN_RECURSOS_COMUNICACAO,IN_RECURSOS_INFORMATICA,IN_INTEGRAL,IN_MATUTINO,IN_VESPERTINO,IN_NOTURNO,NU_INTEGRALIZACAO_INTEGRAL,NU_INTEGRALIZACAO_MATUTINO,NU_INTEGRALIZACAO_VESPERTINO,NU_INTEGRALIZACAO_NOTURNO,NU_INTEGRALIZACAO_EAD,IN_OFERECE_DISC_SEMI_PRES,NU_PERC_CARGA_SEMI_PRES,IN_POSSUI_LABORATORIO,QT_INSC_VAGA_NOVA_INTEGRAL,QT_INSC_VAGA_NOVA_MATUTINO,QT_INSC_VAGA_NOVA_VESPERTINO,QT_INSC_VAGA_NOVA_NOTURNO,QT_INSC_VAGA_NOVA_EAD,QT_INSC_VAGA_REMAN_INTEGRAL,QT_INSC_VAGA_REMAN_MATUTINO,QT_INSC_VAGA_REMAN_VESPERTINO,QT_INSC_VAGA_REMAN_NOTURNO,QT_INSC_VAGA_REMAN_EAD,QT_INSC_PROG_ESP_INTEGRAL,QT_INSC_PROG_ESP_MATUTINO,QT_INSC_PROG_ESP_VESPERTINO,QT_INSC_PROG_ESP_NOTURNO,QT_INSC_PROG_ESP_EAD,QT_INSC_PRINCIPAL_INTEGRAL,QT_INSC_PRINCIPAL_MATUTINO,QT_INSC_PRINCIPAL_VESPERTINO,QT_INSC_PRINCIPAL_NOTURNO,QT_INSC_PRINCIPAL_EAD,QT_INSC_OUTRA_VAGA_INTEGRAL,QT_INSC_OUTRA_VAGA_MATUTINO,QT_INSC_OUTRA_VAGA_VESPERTINO,QT_INSC_OUTRA_VAGA_NOTURNO,QT_INSC_OUTRA_VAGA_EAD,QT_INSC_ANUAL_INTEGRAL,QT_INSC_ANUAL_MATUTINO,QT_INSC_ANUAL_VESPERTINO,QT_INSC_ANUAL_NOTURNO,QT_INSC_ANUAL_EAD,QT_VAGAS_NOVAS_INTEGRAL,QT_VAGAS_NOVAS_MATUTINO,QT_VAGAS_NOVAS_VESPERTINO,QT_VAGAS_NOVAS_NOTURNO,QT_VAGAS_NOVAS_EAD,QT_VAGAS_REMAN_INTEGRAL,QT_VAGAS_REMAN_MATUTINO,QT_VAGAS_REMAN_VESPERTINO,QT_VAGAS_REMAN_NOTURNO,QT_VAGAS_REMAN_EAD,QT_VAGAS_PROG_ESP_INTEGRAL,QT_VAGAS_PROG_ESP_MATUTINO,QT_VAGAS_PROG_ESP_VESPERTINO,QT_VAGAS_PROG_ESP_NOTURNO,QT_VAGAS_PROG_ESP_EAD,QT_VAGAS_PRINCIPAL_INTEGRAL,QT_VAGAS_PRINCIPAL_MATUTINO,QT_VAGAS_PRINCIPAL_VESPERTINO,QT_VAGAS_PRINCIPAL_NOTURNO,QT_VAGAS_PRINCIPAL_EAD,QT_VAGAS_OUTRAS_INTEGRAL,QT_VAGAS_OUTRAS_MATUTINO,QT_VAGAS_OUTRAS_VESPERTINO,QT_VAGAS_OUTRAS_NOTURNO,QT_VAGAS_OUTRAS_EAD,QT_VAGAS_ANUAL_INTEGRAL,QT_VAGAS_ANUAL_MATUTINO,QT_VAGAS_ANUAL_VESPERTINO,QT_VAGAS_ANUAL_NOTURNO,QT_VAGAS_ANUAL_EAD,QT_MATRICULA_TOTAL,QT_CONCLUINTE_TOTAL,QT_INGRESSO_TOTAL,QT_INGRESSO_VAGA_NOVA,QT_INGRESSO_PROCESSO_SELETIVO,QT_VAGA_TOTAL,QT_INSCRITO_TOTAL) values "
var s = fs.createReadStream('./files/DM_CURSO.CSV')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        // pause the readstream
        s.pause();

        if (line.trim() != ""){
            if (lineNumber > 1){ 
                let values = line.split("|").join("','")
                sqlValues += "('" + values + "'),"

                if (lineNumber % BATCH_SIZE == 0){
                    sqlValues = sqlValues.substring(0, sqlValues.length - 1); //tira a vírgula do final do último conjunto de valores
                    connection.query(sqlPrefix + sqlValues, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            throw error
                        };
                        //console.log(results.insertId);
        
                        lineNumber++
                        s.resume();
                    });
                    sqlValues = ""
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
    .on('error', function(err){
        console.log('Error while reading file.', err);
        connection.end();
    })
    .on('end', function(){

        //se houver linhas restantes devido à inserção de X em X, insere no final
        if (sqlValues != ""){
            sqlValues = sqlValues.substring(0, sqlValues.length - 1); //tira a vírgula do final do último conjunto de valores
            connection.query(sqlPrefix + sqlValues, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    throw error
                };
                //console.log(results.insertId);
                connection.end();
            });
        }else{
            connection.end();
        }

        endTime = new Date().getTime()
        console.log("End: ",endTime)
        console.log(endTime - startTime)
    })
);