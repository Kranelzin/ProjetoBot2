from __future__ import print_function, unicode_literals
from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
from datetime import datetime
import funcoes

numero_de_linhas = 0

#ABRIR ARQUIVO DE DESTINATARIOS TXT
arquivoc = open("C:/Users/marce/OneDrive/Área de Trabalho/Projetobot/bot/pessoas.txt",'rb')
contatos = []
for line in arquivoc:
    escrever_contatos = line.rstrip().decode('utf-8')
    contatos.append(escrever_contatos)
    numero_de_linhas = numero_de_linhas + 1
arquivoc.close()    

class Botezinhomelhor:
    def __init__(self):

        self.digitar_pessoas_aqui= contatos
        options = webdriver.ChromeOptions()
        options.add_argument('lang=pt-br')
        self.driver = webdriver.Chrome(executable_path=r'C:/Users/marce/OneDrive/Área de Trabalho/Projetobot/bot/chromedriver.exe', chrome_options=options)
    
    
    def encaminhar(self):

        self.driver.get('https://web.whatsapp.com')
        time.sleep(5)
        self.driver.save_screenshot("../projetobot/public/img/qrcode.png")
        envio_para_contatos = 0
        contagem = 0
        contagemlinhas = 0

        for pessoas in contatos:

            contagemlinhas = contagemlinhas + 1

            if envio_para_contatos == 0: 
                funcoes.enviofuncoes.tentarenvio(self)
            
            
            pesquisar_contatos = self.driver.find_element_by_xpath('//*[@id="app"]/div/span[2]/div/span/div/div/div/div/div/div/div[1]/div/label/div/div[2]')
            time.sleep(2)
            pesquisar_contatos.click()
            pesquisar_contatos.send_keys(pessoas)
            time.sleep(1)
            contagem = contagem + funcoes.enviofuncoes.tentarcontatos(pessoas)
            
            envio_para_contatos = 1

                
            for i in range(len(pessoas)):
                pesquisar_contatos.send_keys(Keys.BACKSPACE)


            if contagem == 5 or contagemlinhas == numero_de_linhas:
                funcoes.enviofuncoes.enviarmensagem(self)
                envio_para_contatos = 0
                contagem = 0
                
        log_de_erro = open("LogErro.txt",'a')
        data_e_hora_atuais = datetime.now()
        data_e_hora_em_texto = data_e_hora_atuais.strftime('%d/%m/%Y %H:%M')
        log_de_erro.write("Log de Erro gerado em: ")
        log_de_erro.write(data_e_hora_em_texto)
        log_de_erro.write("\n")
        log_de_erro.close()

        
teste = Botezinhomelhor()
teste.encaminhar()

