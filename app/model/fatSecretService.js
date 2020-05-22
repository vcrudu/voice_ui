import APP_SETTINGS  from '../constants/appSettings';
class FatSecretService {
    search(search_expression, token, callback) {
        $.ajax({
                url: APP_SETTINGS.serverApiUrl + "fatsecret/search?search_expression="+search_expression+"&token="+token,
                type: "GET",
                crossDomain: true,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done((data)=> {
                if(callback) callback(null, data.result.foods.food);
            }).fail((error)=> {
                if(callback) callback(error, null);
            });
    }
}

const fatSecretService = new FatSecretService();

export default fatSecretService;