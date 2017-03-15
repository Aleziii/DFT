var xn, xdados;
var graficoMagnitude, graficoPhase;
var regex = /\d+(?=\*n\*ts)/ig;

function calcula(){
	var iframes = document.getElementsByClassName(("chartjs-hidden-iframe"));
	while (iframes.length > 0) iframes[0].remove();

	//$('#calculos').replaceWith('<canvas id="calculos"></canvas>');
	//$('#magnitude').replaceWith('<canvas id="canvas"></canvas>');
	//$('#phase').replaceWith('<canvas id="phase" style="margin-bottom: 30px; padding-bottom: 35px;"></canvas>');

	var gmagnitude = document.getElementById("magnitude");
	var gphase = document.getElementById("phase");
	var gcalculos = document.getElementById("calculos");

	var dadosMagnitude = [], labels = [], label2 = [],
	dadosPhase = [], dados = [];
	var N = document.getElementById("qpontos").value;
	var funcao = document.getElementById("funcao").value;
	var f1 = document.getElementById("valor_f").value;

	var frequencia = funcao.match(regex);
	frequencia.sort(function(a, b){return b-a});

	var ts = 1.0/(f1*frequencia[0]), fs = 1.0/ts, scope = {n : 0, ts};
	var i = 0; //iterar valores de x[n]

	for(m = 0; m < N; m++){
		real = 0; img = 0;
		for(n = 0; n < N; n++){
			scope.n = n; //Atualizacao do valor de n para o mathjs
			xn = math.eval(funcao, scope);

			if(i < N){
			//Valores de x[n] 
			xdados = math.eval(funcao, scope);
			dados.push(Math.round(xdados*10000)/10000);
			i++;
		}

		real += xn * Math.cos(2*Math.PI*n*m/N);
		img += -1 * xn * Math.sin(2*Math.PI*n*m/N);	
	}
	if (real > -0.0001 && real < 0.0001) real = 0.0;
	if (img > -0.0001 && img < 0.0001) img = 0.0;


		//Calculo da frequencia
		labels.push(m*fs/N);
		label2.push(m);

		dadosMagnitude.push(Math.round(magnitude(real,img)*10000)/10000);
		dadosPhase.push(Math.round(phase(real,img)*10000)/10000);
	}

	//Impressao do array
	dados.forEach(function(valor,index){
		console.log(valor, index);
	});

	//Gráficos
	var conf1 = configuracoes("Magnitude", "Gráfico da Magnitude", dadosMagnitude, labels, 'rgb(255, 159, 64)', 'Frequência (hz)');
	var conf2 = configuracoes("Fase", "Gráfico de Fase", dadosPhase, labels, 'rgb(54, 162, 235)', 'Frequência (hz)');
	var conf3 = configuracoes("X[n]", "Valores de X[n]", dados, label2, 'rgba(255, 0, 0, 0.6)', 'Amostras (n)');
	graficoMagnitude = new Chart(gmagnitude, conf1);
	graficoPhase = new Chart(gphase, conf2);
	graficoCalculos = new Chart(gcalculos, conf3);

	document.getElementById("btnCalcula").disabled = true;
}

function magnitude(x, y){
	var mag;
	return Math.sqrt((Math.pow(x,2))+(Math.pow(y,2)));
}

function phase(x, y){
	var phase;
	phase = Math.atan(y/x);
	phase = (phase*180)/Math.PI;
	return Number.isNaN(phase) ? 0.0 : phase;
}

function limpar(){
	graficoPhase.destroy();
	graficoMagnitude.destroy();
}

function configuracoes(nome, titulo, dados, labels, cor, labelX){
	return {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: nome,
				data: dados,
				backgroundColor: cor,
				borderColor: cor,
				fill: false,
				pointHitRadius: 55,
				showLine: false 
			}]
		},
		options: {
			responsive: true,
			display: false,
			legend: {
				position: 'top',
			},
			hover: {
				mode: 'index'
			},
			scales: {
				xAxes: [{
					display: true,
					gridLines:{
						display: false
					},
					scaleLabel: {
						display: true,
						labelString: labelX
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: nome
					},
					gridLines:{
						display: false
					},
					ticks: {
						beginAtZero:true
					}
				}]
			},
			title: {
				display: true,
				text: titulo
			}
		}
	}
}

function alterarValor(valor){
	document.getElementById("valor_range").textContent = valor;
}
