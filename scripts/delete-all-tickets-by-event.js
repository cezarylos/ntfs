const jwt = process.argv[2];
const eventId = process.argv[3];

const init = async () => {
  const res = await fetch(
    `https://cms.realbrain.art/api/tickets?filters[event][id][$eq]=${eventId}&pagination[limit]=-1`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt
      }
    }
  );

  const { data } = await res.json();

  const ids = data.map(ticket => ticket.id);
  ids.forEach(id => {
    fetch(`https://cms.realbrain.art/api/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt
      }
    });
  });
};

init();
