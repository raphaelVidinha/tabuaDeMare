module.exports = {

  formatedNameJson : (name) => {
    const strCount = name.split(' ').length;

    for(let i = 0; i < strCount; i++) {
      name = name.replace(' ', '_');
    }
      return `${name.toLowerCase()}.json`;
    }

};
