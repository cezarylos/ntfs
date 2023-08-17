const jwt = process.argv[2];
const eventId = process.argv[3];
const amount = process.argv[4];

const createWithConnect = async () => {
  const createRes = await fetch('https://cms.realbrain.art/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt
    },
    body: JSON.stringify({
      data: {
        holderAddress: null,
        title: '',
        description: '',
        tokenIds: null,
        isRewardCollected: false
      }
    })
  });

  const {
    data: { id }
  } = await createRes.json();

  await fetch(`https://cms.realbrain.art/api/tickets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt
    },
    body: JSON.stringify({
      data: {
        event: {
          connect: [eventId]
        }
      }
    })
  });
};

const init = async () => {
  for (let i = 0; i < amount; i++) {
    await createWithConnect();
  }
};

init();
