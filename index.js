const inquirer = require('inquirer');
const sqlite3 = require('sqlite3').verbose();
//Esto es un comentario de una sola línea.
/*Esto es un comentario  de varias  líneas.*/
function opciones_generales() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'valor',
				message: 'Registro y verificación de usuario',
				choices: [
					'Registrar nuevo usuario',
					'Buscar usuario registrado',
					'Salir',
				],
			},
		])
		.then((objeto1) => {
			if (objeto1.valor != 'Salir') {
				if (objeto1.valor === 'Registrar nuevo usuario') {
					// Invocación de la función registros.
					registros();
				} else {
					// Invocación de la función consultas.
					consultas();
				}
			} else {
				// Imprime por pantalla la información.
				console.log('Gracias por utilizar nuestros servicios');
			}
		});
}

function registros() {
	inquirer
		.prompt([
			{
				name: 'name',
				message: 'Nombre: ',
			},
			{
				name: 'identification',
				message: 'Número de identificación: ',
			},
			{
				name: 'address',
				message: 'Dirección de residencia: ',
			},
			{
				name: 'phone',
				message: 'Número de teléfono: ',
			},
			{
				name: 'email',
				message: 'Correo electrónico: ',
			},
		])
		.then((objeto2) => {
			let respuestas = [objeto2]; // Guarda los datos en la variable
			respuestas;
			/* Crea un archivo de base de datos y abre automáticamente */
			let db = new sqlite3.Database('./DB/Datos_Usuarios.db');
			/* fin */
			db.serialize(function () {
				/* Crea una tabla con la estructura necesaria para almacenar los
               datos (usa lenguaje SQL) */
				db.run(
					'CREATE TABLE if not exists usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30),identification INTEGER(10), address VARCHAR(30), phone INTEGER(10), email VARCHAR(100))'
				);
				/* fin */
				/* Inserta y guarda la información */
				let stmt = db.prepare(
					'INSERT INTO usuarios (name,identification,address,phone,email) VALUES (?,?,?,?,?)'
				);
				for (let u of respuestas) {
					stmt.run(u.name, u.identification, u.address, u.phone, u.email);
					/* Muestra por pantalla la información registrada */
					console.log(
						`El usuario: ${u.name} con nro: ${u.identification}, ha sido registrado exitosamente\n `
					);
					/* fin */
				}
				stmt.finalize();
				/* fin */
			});
			/* Cierra la base de datos */
			db.close();
			/* fin */
			opciones_generales(); // Invocación de la función opciones generales.
		});
}

function consultas() {
	console.log('\n Bienvenido al sistema de consulta\n');
	inquirer
		.prompt([
			{
				name: 'identification',
				message: 'Por favor digita tu número de identificación: ',
			},
			{
				name: 'phone',
				message: 'Por favor ingresa tu número de teléfono: ',
			},
		])
		.then((objeto3) => {
			let db = new sqlite3.Database('./DB/Datos_Usuarios.db'); //Conexión a la base de datos
			let ID = objeto3.identification;
			let PHONES = objeto3.phone;
			/*  Realiza una validación de la información entregada (identification, phone)  en la tabla usuarios*/
			let sql =
				'SELECT name NAME, identification IDENTIFICATION, phone PHONES  FROM usuarios WHERE (identification,phone)=(?,?)';

			db.get(sql, [ID, PHONES], (err, row) => {
				if (err) {
					/* Si existe algún error al momento de hacer la consulta, muestra por pantalla ese error*/
					return console.error(err.message);
				}
				/* Válida la información usando un condicional if*/
				if (row) {
					/* Si la información existe en la base de datos imprime por pantalla los datos del usuario consultado */
					console.log(
						`\n El usuario se encuentra registrado en la base de datos. 
                   \n Datos del usuario
                   \n Nombre: ${row.NAME}
                   \n Nro: ${row.IDENTIFICATION}
                   \n Teléfono: ${row.PHONES}\n `
					);
					/* Si el proceso fue un éxito cierra la base de datos */
					db.close();
					/* Invocación de la función opciones generales */
					opciones_generales();
				} else {
					/* En caso de que  la información no exista, se le indica  al usuario por pantalla */
					console.log(
						`\n Algo anda mal con tus datos, por favor verifícalos e inténtalo de nuevo.\n`
					);
					/* Cierra la base de datos */
					db.close();
					/* Se le  permite una nueva consulta al usuario */
					nueva_consulta(); // Invocación de la función nueva_consulta
				}
			});
		});
}
function nueva_consulta() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'valor1',
				message: '¿Qué deseas hacer?',
				choices: ['Continuar con la consulta', 'Salir'],
			},
		])
		.then((objeto4) => {
			if (objeto4.valor1 != 'Salir') {
				/* Invoca a la función consultas, solo para realizar una nueva consulta, aunque también se puede hacer desde la función opciones_generales. */
				consultas();
			} else {
				/* Invoca a la función opciones generales, para registrar o consultar usuarios */
				opciones_generales();
			}
		});
}
// Invocación de la función opciones generales.
opciones_generales();
