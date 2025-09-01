# SDK Logging

The SDK is able to emit log messages through a registered callback logger. This means the SDK is independant of any logging framework, and as a consumer of the SDK you can implement a custom logger that can receive SDK log messages and use your preferred logging framework to log them to a source of your choice. Two "built in" loggers are provided for convienience, that must be registered to become active.

## Creating and Registering a Custom Logger

A Logger is a class that extents type `Logger`  
For example a simple console logger, that just logs the message:

```typescript
class ConsoleLogger extends Logger {
    DEFAULT_VERBOSITY: LogVerbosity = 'info';
    private config: LoggerConfig = {
        verbosity: this.DEFAULT_VERBOSITY
    };
    log(entry: LoggedItem): void {
        console.log(`${entry.message}`);
    }
    setConfig(config: LoggerConfig): void {
        this.config = config;
    }
    resetConfig(): void {
        this.config = {
            verbosity: this.DEFAULT_VERBOSITY
        };
    }
    getConfig(): LoggerConfig {
        return this.config;
    }
}
```

The custom Logger must implement methods are:
- `log` : Receives the callback from the SDK to log the message
- `setConfig` : Will receive a callback from the SDK with the intended logger config
- `resetConfig` : A request for the logger to reset its config to its default
- `getConfig` : A getter for the loggers current config

To register this example as the logger to use:

```typescript
LoggerRegistry.getInstance().registerLogger(new ConsoleLogger());
```

Note only one Logger can be registered.

## Configuring a Logger

When a Logger is registered the SDK will load environment variable: SDK_LOG_VERBOSITY  
The value of that variable is then passed to the `setConfig` callback function of the registered Logger  
It is then up to the logger to re-configure itself (using its own framework) to set the requested config  

SDK_LOG_VERBOSITY can take values: 'debug' | 'info' | 'warn' | 'error'

A custom source for the environment variable can be set via:

```typescript
LoggerRegistry.setConfigSource(source: LoggerConfigSource)
```

If SDK_LOG_VERBOSITY is undefined then LoggerRegistry.DEFAULT_LOG_VERBOSITY (info level) will be used


Note: 
The SDK *sends all log messages of all verbosities to the registered Logger*  
It is up to the registered Logger to perform verbosity filering through its own framework  

## Built-in Loggers

Two default loggers are provided, that can be registered if needed:
- JSONLogger : Writes log message to console in JSON format. This is useful for DataDog/CloudWatch etc.
- PrettyLogger : Writes colorized log messages with an icon to console

To register a default logger:

```typescript
const logger = new JSONLogger();
logger.register();
```

## Using the SDK to Write Log Messages

You can use the SDK `log` function to write log messages, this calls the `log` method on the registered Logger.
However if your registered logger is using a log framework, you may choose to log directly with that framework.

An example calling the `log` function:

```typescript
log({ verbosity: 'info', message: 'my log message', source: 'test', context: { data: { key: 'value' } } });
```

- `verbosity` : The log level
- `message` : The log message
- `source` : (optional) The source of the log message, for example a fully qualified path of the source code
- `context` : (optional) An object the app was processing at the time

## On The Fly Config Changes

As the SDK reads an environment variable, app restarts are needed to pickup any new config.  
However you may register a custom Logger that is able to listen for its own dynamic config changes

## HTTP Requests & Responses

The HttpClient built into the SDK to communicate with Thor emits log messages for requests & responses  
These are emitted with verbosity levels:

- debug : When http status 200 is received
- warn : When no response was received
- error : When http status >= 400 is received

Enabling the appropriate verbosity level will allow to see the full http communications to Thor