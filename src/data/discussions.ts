
export const discussionsData = [
  {
    id: 1,
    title: 'Discussion on Week 3 Readings',
    participants: 8,
    summary: 'This discussion revolves around the key concepts from the Week 3 readings, with a focus on the practical applications of the theories discussed. Students shared diverse perspectives and provided real-world examples.',
    graphData: {
      nodes: [
        { id: 'Jon Snow', name: 'Jon Snow', posts: 2, replies: 3, group: 1 },
        { id: 'Cersei Lannister', name: 'Cersei Lannister', posts: 1, replies: 2, group: 1 },
        { id: 'Jaime Lannister', name: 'Jaime Lannister', posts: 1, replies: 1, group: 1 },
        { id: 'Arya Stark', name: 'Arya Stark', posts: 3, replies: 4, group: 2 },
        { id: 'Daenerys Targaryen', name: 'Daenerys Targaryen', posts: 2, replies: 2, group: 2 },
      ],
      links: [
        { source: 'Jon Snow', target: 'Cersei Lannister', value: 2 },
        { source: 'Jon Snow', target: 'Arya Stark', value: 1 },
        { source: 'Cersei Lannister', target: 'Jaime Lannister', value: 1 },
        { source: 'Arya Stark', target: 'Daenerys Targaryen', value: 3 },
        { source: 'Daenerys Targaryen', target: 'Jon Snow', value: 1 },
      ],
    },
  },
  {
    id: 2,
    title: 'Project Brainstorming Session',
    participants: 8,
    summary: 'This thread is a brainstorming session for the final project. Students are proposing ideas, forming groups, and discussing potential project scopes. The conversation is active and collaborative.',
    graphData: {
      nodes: [
        { id: 'Ferrara Clifford', name: 'Ferrara Clifford', posts: 4, replies: 2, group: 3 },
        { id: 'Rossini Frances', name: 'Rossini Frances', posts: 2, replies: 3, group: 3 },
        { id: 'Harvey Roxie', name: 'Harvey Roxie', posts: 3, replies: 1, group: 4 },
        { id: 'Jon Snow', name: 'Jon Snow', posts: 1, replies: 2, group: 4 },
      ],
      links: [
        { source: 'Ferrara Clifford', target: 'Rossini Frances', value: 3 },
        { source: 'Ferrara Clifford', target: 'Harvey Roxie', value: 1 },
        { source: 'Rossini Frances', target: 'Jon Snow', value: 2 },
        { source: 'Harvey Roxie', target: 'Ferrara Clifford', value: 1 },
      ],
    },
  },
];
