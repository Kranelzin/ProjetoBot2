from __future__ import print_function, unicode_literals
from selenium import webdriver
import time
from selenium.webdriver.common.keys import Keys
from datetime import datetime


class enviofuncoes():

    def tentarenvio(self):
        
        while True:
            try:
                caixa_de_pesquisa = self.driver.find_element_by_xpath('//*[@id="side"]/div[1]/div/label/div/div[2]')
                time.sleep(1)
                caixa_de_pesquisa.click()
                time.sleep(1)
                
                caixa_de_pesquisa.send_keys(Keys.BACKSPACE)
                caixa_de_pesquisa.send_keys(Keys.BACKSPACE)
                caixa_de_pesquisa.send_keys(Keys.BACKSPACE)
                caixa_de_pesquisa.send_keys(Keys.BACKSPACE)
                caixa_de_pesquisa.send_keys(Keys.BACKSPACE)
                caixa_de_pesquisa.send_keys('Envio Online')

                
                time.sleep(3)
                contato_da_mensagem = self.driver.find_element_by_xpath("//span[@title='Envio']")
                time.sleep(2)
                contato_da_mensagem.click()
                time.sleep(2)
                
                encaminhar = self.driver.find_element_by_xpath('//span[@data-icon="forward-chat"]')
                time.sleep(2)
                encaminhar.click()
                break
            except Exception:
                True

    def tentarcontatos(self,pessoas):
                
        try:
            selecionar_contato = self.driver.find_element_by_xpath('//*[@id="app"]/div/span[2]/div/span/div/div/div/div/div/div/div[2]/div[1]/div/div/div[2]/div/div[2]/div')
            time.sleep(2)
            selecionar_contato.click()
            return 1

        except Exception:
            try:
                selecionar_grupo = self.driver.find_element_by_xpath('//*[@id="app"]/div/span[2]/div/span/div/div/div/div/div/div/div[2]/div[1]/div/div/div[1]/div/div[2]/div')
                selecionar_grupo.click()
                time.sleep(2)
                return 1

            except Exception:
                log_de_erro = open("LogErro.txt",'a')
                log_de_erro.write("O seguinte contato não foi encontrado: ")
                log_de_erro.write(pessoas)
                log_de_erro.write("\n")
                return -1
    def enviarmensagem(self):
        while True:
            try:
                time.sleep(2)
                enviar = self.driver.find_element_by_xpath('//*[@id="app"]/div/span[2]/div/span/div/div/div/div/div/div/span/div/div/div')
                time.sleep(2)
                enviar.click()
                time.sleep(3)
                False
                return 0
            except Exception:
                True

