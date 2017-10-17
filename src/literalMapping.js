const mappings =
    [
      {
        label: 'String',
        description: 'A assortment of letters',
        uri: 'http://www.w3.org/2001/XMLSchema#string',
        variableToAdd: [],
      },
      {
        label: 'Language tagged String',
        description: 'Language tagged string',
        uri: 'http://www.w3.org/2001/XMLSchema#string',
        variableToAdd: ['language'],
      },
      {
        label: 'Integer',
        description: '',
        uri: 'http://www.w3.org/2001/XMLSchema#integer',
        variableToAdd: [],
      },
      {
        label: 'Float',
        description: '',
        uri: 'http://www.w3.org/2001/XMLSchema#float',
        variableToAdd: [],
      },
      {
        label: 'Double',
        description: '',
        uri: 'http://www.w3.org/2001/XMLSchema#double',
        variableToAdd: [],
      },
      {
        label: 'Long',
        description: '',
        uri: 'http://www.w3.org/2001/XMLSchema#long',
        variableToAdd: [],
      },
      {
        label: 'Date',
        description: 'YYYY-MM-DD',
        uri: 'http://www.w3.org/2001/XMLSchema#date',
        variableToAdd: [],
      },
      {
        label: 'Date-time',
        description: '',
        uri: 'http://www.w3.org/2001/XMLSchema#datetime',
        variableToAdd: [],
      },
      {
        label: 'Other',
        description: '',
        variableToAdd: ['typeURI'],
      },
    ];

export default mappings;
