var Docker = require('dockerode');

// var docker4 = new Docker({
//     host: '127.0.0.1',
//     port: 3000
//   });
var docker = new Docker({socketPath: '/var/run/docker.sock'});
// console.log(docker);
  docker.listContainers(function (err, containers) {
    console.log(containers);
    containers.forEach(function (containerInfo) {
      a=docker.getContainer(containerInfo.Id);
      console.log(a);
    });
  });

  docker.createContainer({
    ID: 'jokal',
    Image: 'node',
    Names:'jokal',
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
    OpenStdin: false,
    StdinOnce: false
  }).then(function(container){
    return container.start();
  })