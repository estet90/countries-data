## COUNTRIES-DATA

### 1. Предварительные условия
* На сервере IBM Integration Bus создан брокер и сервер интеграции и выполнена команда `. <установочный каталог IIB>/bin/mqsiprofile`
* На сервере IBM MQ создан администратор очередей и выполнена команда `. /opt/mqm/bin/setmqenv -s`
* На сервере БД установлена СУБД mongodb
* Выполнить команду `chmod +x <каталог с приложениями и скриптами>/scripts -R`
* При необходимости импортировать файл *scripts/soap-ui/countries-data-soapui-project.xml* в SoapUI

### 2. Настройка
#### 2.1 Создание БД
* На сервере с mongodb выполнить скрипт *scripts/mongo/create_db.sh*

#### 2.2 Добавление возможности работать с БД через LoopBackRequest
* На сервере IBM Integration Bus выполнить из каталога */var/mqsi/node_modules* команду
`npm install loopback-connector-mongodb`
* Положить файл *config/datasources.json* в каталог */var/mqsi/connectors/loopback*
* Перезапустить, выполнив последовательно команды от имени пользователя IIB:
<br/>
`$ mqsistop <наименование брокера>`
<br/>
`$ mqsistart <наименование брокера>`

#### 2.3 Создание очереди для логирования
* На сервере IBM MQ выполнить скрипт *scripts/mq/create_queue.sh* от имени пользователя MQ, передав в качестве параметра наименование администратора очередей.
<br/>
Пример запуска:
<br/>
`$ ./create_queue.sh QM`

### 3. Сборка и установка приложения
* Поместить скрипт *scripts/iib/create_bar.sh* в каталог с исходниками и запустить его без параметров
* Поместить скрипт *scripts/iib/deploy_bar.sh* в каталог с собранным bar-файлом и запустить, передав в качестве параметров наименование брокера и сервера интеграции.
<br/>
Пример запуска:
`./deploy_bar.sh MB test`

### 4. Настройка приложения
* Через админку брокера можно установить свойства:
<br/>
*logLevel* - уровень логирования - 1 для логирования только ошибок, 2 логирование запроса и ошибок, 3 логирование всего
<br/>
*logDirectory* - базовый каталог для ведения логирование
*logQueue* - очередь, с которой сообщения записываются в логирование
*loopBackTimeout* - таймаут обращения к БД

### 5. Работа с приложением

#### 5.1 Сервис getCountryInfoByName
Пример запроса:
<br/>
http://localhost:7800/CountriesData
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountryInfoByNameRequest>
         <name>Россия</name>
      </coun:getCountryInfoByNameRequest>
   </soapenv:Body>
</soapenv:Envelope>`
<br/>
Пример ответа:
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountryInfoByNameResponse>
         <name>Россия</name>
         <capital>Москва</name>
         <name>10000</name>
      </coun:getCountryInfoByNameResponse>
   </soapenv:Body>
</soapenv:Envelope>`

#### 5.2 Сервис getCountryInfoByCapital
Пример запроса:
<br/>
http://localhost:7800/CountriesData
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountryInfoByCapitalRequest>
         <capital>Москва</capital>
      </coun:getCountryInfoByCapitalRequest>
   </soapenv:Body>
</soapenv:Envelope>`
<br/>
Пример ответа:
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountryInfoByCapitalResponse>
         <name>Россия</name>
         <capital>Москва</name>
         <name>10000</name>
      </coun:getCountryInfoByCapitalResponse>
   </soapenv:Body>
</soapenv:Envelope>`

#### 5.3 Сервис getCountriesInfoByArea
Пример запроса:
<br/>
http://localhost:7800/CountriesData
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountriesInfoByAreaRequest>
         <name>Страна Лимония</name>
         <largerThan>FALSE</largerThan>
      </coun:getCountriesInfoByAreaRequest>
   </soapenv:Body>
</soapenv:Envelope>`
<br/>
Пример ответа:
<br/>
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <coun:getCountriesInfoByAreaResponse>
         <countries>
             <country>
                 <name>Россия</name>
                 <capital>Москва</name>
                 <name>10000</name>
             </country>
         </countries>
      </coun:getCountriesInfoByAreaResponse>
   </soapenv:Body>
</soapenv:Envelope>`

#### 5.4 Сообщение об ошибке
`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:coun="http://CountriesData">
   <soapenv:Header/>
   <soapenv:Body>
      <soapenv:Fault>
         <faultcode>0</faultcode>
         <faultstring>Ошибка</faultstring>
         <faulactor>/CountriesData</faulactor>
         <detail>
            <text>Описание ошибки</text>
         </detail>
      </soapenv:Fault>
   </soapenv:Body>
</soapenv:Envelope>`
