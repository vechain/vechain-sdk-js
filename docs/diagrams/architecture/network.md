```mermaid
classDiagram
    class AccountModule {
        AccountModule constructor(HttpClient httpClient)
        Promise~AccountDetail~ getAccount(Address address, AccountInputOption options)
        Promise~string~ getByteCode(Address address, AccountInputOption options)
        Promise~string~ getStorageAt(Address address, ThorId position, AccountInputOptions options)
    }
    class HttpClient {
        <<interface>>
        string baseUrl
        Promise~unknown~ get(string path, HttpParams path)
        Promise~unknown~ post(string path, HttpParams path)
    }
    class ThorClient {
        AccountModule accounts;
        ThorClient at(string url, BlockModuleOptions options)$
        destroy()
    }
    AccountModule *-- ThorClient
    HttpClient o-- ThorClient
    
```
