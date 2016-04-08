var Klepet = function(socket) {
  this.socket = socket;
};

Klepet.prototype.posljiSporocilo = function(kanal, besedilo) {
  var sporocilo = {
    kanal: kanal,
    besedilo: besedilo
  };
  this.socket.emit('sporocilo', sporocilo);
};

Klepet.prototype.spremeniKanal = function(kanal) {
  this.socket.emit('pridruzitevZahteva', {
    novKanal: kanal
  });
};

Klepet.prototype.procesirajUkaz = function(ukaz) {
  var besede = ukaz.split(' ');
  ukaz = besede[0].substring(1, besede[0].length).toLowerCase();
  var sporocilo = false;

  switch(ukaz) {
    case 'pridruzitev':
      besede.shift();
      var kanal = besede.join(' ');
      this.spremeniKanal(kanal);
      break;
    case 'vzdevek':
      besede.shift();
      var vzdevek = besede.join(' ');
      this.socket.emit('vzdevekSpremembaZahteva', vzdevek);
      break;
    case 'zasebno':
      besede.shift();
      var besedilo = besede.join(' ');
      var parametri = besedilo.split('\"');
      if (parametri) {
        this.socket.emit('sporocilo', { vzdevek: parametri[1], besedilo: parametri[3] });
        sporocilo = '(zasebno za ' + parametri[1] + '): ' + parametri[3];
      } else {
        sporocilo = 'Neznan ukaz';
      }
      break;
    case 'dregljaj':
      besede.shift();
      var dregljajZa = besede.join(' ');
      var obstaja = false;

      var imena = $("#seznam-uporabnikov div");

      for (var i = 0; i < imena.length; i++) {
        if(imena[i].innerHTML == dregljajZa) {
          obstaja = true;
          break;
        }
      }

      if (!obstaja) {
        sporocilo = 'Neznan ukaz.';
      } else {
        sporocilo = 'Dregljaj za ' + dregljajZa;
        this.socket.emit('dregljaj', {vzdevek: dregljajZa});
      }


      // this.socket.once('uporabniki', function(uporabniki) {
      //   var obstaja = false;
      //   for (var i=0; i < uporabniki.length; i++) {
      //     console.log("'%s' ? '%s'", dregljajZa, uporabniki[i]);
      //     if (dregljajZa == uporabniki[i]) {
      //       obstaja = true;
      //       this.socket.emit('dregljaj', {vzdevek: dregljajZa});
      //       break;
      //     }
      //   }
      //   if (!obstaja) {
      //     return 'Neznan ukaz.';
      //   } else {
      //     return ('Dregljaj za ' + dregljajZa);
      //   }
      // });
      break;
    default:
      sporocilo = 'Neznan ukaz.';
      break;
  };

  return sporocilo;
};
