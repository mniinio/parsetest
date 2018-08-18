window.addEventListener('load', () => {
    const el = $('#app');

    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const ratesTemplate = Handlebars.compile($('#rates-template').html());
    const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
    const historicalTemplate = Handlebars.compile($('#historical-template').html());
    const profileTemplate = Handlebars.compile($('#profile-template').html());

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
        const html = errorTemplate({
            color: 'yellow',
            title: 'Error 404 - Page NOT Found!',
            message: `The path '/${path}' does not exist on this site`,
        });
        el.html(html);
        },
    });

    // Instantiate api handler
    const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
    });

    // Display Error Banner
    const showError = (error) => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: 'red', title, message });
    el.html(html);
    };

    // Display Latest Currency Rates
    router.add('/', async () => {
    // Display loader first
    let html = ratesTemplate();
    el.html(html);
    try {
      console.clear();

      setTimeout(function(){
        document.querySelector('input[type="checkbox"]').setAttribute('checked',true);
      },100);
        html = ratesTemplate({ base, date, rates });
        el.html(html);
    } catch (error) {
        showError(error);
    } finally {
        // Remove loader status
        $('.loading').removeClass('loading');
    }
    });
    // Perform POST request, calculate and display conversion results
    const getConversionResults = async () => {
        // Extract form data
        const from = $('#from').val();
        const to = $('#to').val();
        const amount = $('#amount').val();
        // Send post data to Express(proxy) server
        try {
        const response = await api.post('/convert', { from, to });
        const { rate } = response.data;
        const result = rate * amount;
        $('#result').html(`${to} ${result}`);
        } catch (error) {
        showError(error);
        } finally {
        $('#result-segment').removeClass('loading');
        }
    };

    // Handle Convert Button Click Event
    const convertRatesHandler = () => {
        if ($('.ui.form').form('is valid')) {
        // hide error message
        $('.ui.error.message').hide();
        // Post to Express server
        $('#result-segment').addClass('loading');
        getConversionResults();
        // Prevent page from submitting to server
        return false;
        }
        return true;
    };

    router.add('/exchange', async () => {
        // Display loader first
        let html = exchangeTemplate();
        el.html(html);
        try {
        // Load Symbols
        const response = await api.get('/symbols');
        const { symbols } = response.data;
        html = exchangeTemplate({ symbols });
        el.html(html);
        $('.loading').removeClass('loading');
        // Validate Form Inputs
        $('.ui.form').form({
            fields: {
            from: 'empty',
            to: 'empty',
            amount: 'decimal',
            },
        });
        // Specify Submit Handler
        $('.submit').click(convertRatesHandler);
        } catch (error) {
        showError(error);
        }
    });

    const getHistoricalRates = async () => {
        const date = $('#date').val();
        try {
          const response = await api.post('/historical', { date });
          const { base, rates } = response.data;
          const html = ratesTemplate({ base, date, rates });
          $('#historical-table').html(html);
        } catch (error) {
          showError(error);
        } finally {
          $('.segment').removeClass('loading');
        }
      };

      const historicalRatesHandler = () => {
        if ($('.ui.form').form('is valid')) {
         n // hide error message
          $('.ui.error.message').hide();
          // Indicate loading status
          $('.segment').addClass('loading');
          getHistoricalRates();
          // Prevent page from submitting to server
          return false;
        }
        return true;
      };

      router.add('/historical', () => {
        // Display form
        const html = historicalTemplate();
        el.html(html);
        // Activate Date Picker
        $('#calendar').calendar({
          type: 'date',
          formatter: { //format date to yyyy-mm-dd
            date: date => new Date(date).toISOString().split('T')[0],
          },
        });
        // Validate Date input
        $('.ui.form').form({
          fields: {
            date: 'empty',
          },
        });
        $('.submit').click(historicalRatesHandler);
      });

      //TEAM

      const createNewTeam = async () => {
        console.log("lomakkeen kentä");
        const { team } = { team: $('#teamName').val()};
        console.log("lomakkeella");
        console.log( { team });
        try {
          const response = await api.post('/team', { team });
        } catch (error) {
          showError(error);
        } finally {
          $('.segment').removeClass('loading');
        }
      };

      const getTeams = async () => {
        try {
            const response = await api.get('/teams');
            const { results } = response.data;
            console.log(response.data);
            console.log("ollaan app.js");
            console.log( { results });
          const html = teamTemplate({ results });
          $('#team-table').html(html);
        } catch (error) {
          showError(error);
        } finally {
          $('.segment').removeClass('loading');
        }
      };

      const teamsHandler = () => {
        console.log("handlerissa");
        if ($('.ui.form').form('is valid')) {
         // hide error message
          $('.ui.error.message').hide();
          // Indicate loading status
         // $('.segment').addClass('loading');
          createNewTeam();
          console.log("create nwe team");
          getTeams();
          // Prevent page from submitting to server
          return false;
        }
        console.log("ei validi");
        return true;
      };



      router.add('/profile', async () => {
        // Display form
        const html = profileTemplate();
        el.html(html);
        // Validate text input

          var $btnSets = $('#responsive'),
          $btnLinks = $btnSets.find('a');

          $btnLinks.click(function(e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
          var index = $(this).index();
          $("div.user-menu>div.user-menu-content").removeClass("active");
          $("div.user-menu>div.user-menu-content").eq(index).addClass("active");
        });

        $("[rel='tooltip']").tooltip();

        $('.view').hover(
      function(){
          $(this).find('.caption').slideDown(250); //.fadeIn(250)
      },
      function(){
          $(this).find('.caption').slideUp(250); //.fadeOut(205)
      }
  );







});



      // Navigate app to current url
      router.navigateTo(window.location.pathname);

       // Highlight Active Menu on Refresh/Page Reload
      const link = $(`a[href$='${window.location.pathname}']`);
      link.addClass('active');

      $('a').on('click', (event) => {
        // Block browser page load
        event.preventDefault();

        // Highlight Active Menu on Click
        const target = $(event.target);
        $('.item').removeClass('active');
        target.addClass('active');

        // Navigate to clicked url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
      });
  });
