type ParsedCommand = Record<string,string[]>

export class CommandParser{
  static parse(cliArguments: string[]): ParsedCommand{
    const parsedCommand: ParsedCommand = {};
    let current = '';

    for(const argument of cliArguments){
      if(argument.startsWith('--')){
        parsedCommand[argument] = [];
        current = argument;
      } else if(current && argument){
        parsedCommand[current].push(argument);
      }
    }
    return parsedCommand;
  }
}

