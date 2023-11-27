// Transform Data
export const transform = (data) => {
    const sanitizedData = {};
    for (const key in data) {
        if (typeof data[key] === "string" && data[key].length === 0) continue;
        sanitizedData[key] = data[key]; 
    }
    return sanitizedData;
  };

  // Match Suggestions
  export const matchSuggestion = (filter, choice) => {
    return (
      choice.company_name && choice.company_name?.toLowerCase().includes(filter.toLowerCase())
    );
  };
  
  // Input Text 
  export const inputText = choice => {
    return (
      `${choice.company_name}`
    )
  } 
  
  // render Options
  export const OptionRenderer = choice => {
    return  (
      <span>
          {choice.company_name}
      </span>
    )
  };