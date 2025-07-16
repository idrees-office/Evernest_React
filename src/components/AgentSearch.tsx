import React, { useState } from 'react';
import Select from 'react-select';
import IconSearch from './Icon/IconSearch'; 

interface AgentOption {
  value: number;
  label: string;
}

interface Props {
  agents: AgentOption[];
  onSearch: (agent_id: number | null) => void;
}

const AgentSearch: React.FC<Props> = ({ agents, onSearch }) => {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  const handleSearch = () => {
    onSearch(selectedAgent);
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="w-[200px]">
        <Select
          placeholder="Select Agent"
          options={agents}
          classNamePrefix="custom-select"
          onChange={(option) => setSelectedAgent(option?.value ?? null)}
        />
      </div>
      <button onClick={handleSearch} className="btn btn-secondary btn-sm flex items-center"
      >
        <IconSearch /> &nbsp;Search
      </button>
    </div>
  );
};

export default AgentSearch;
