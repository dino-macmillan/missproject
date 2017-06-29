using Miss.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Miss.DataService
{

    public interface IDataService
    {
        List<Location> GetData();
        void SaveData(IList<Location> data);

    }

    public class LocationDataService : IDataService
    {
        string _path = string.Empty;
        string fileName = "Data.txt";

        public LocationDataService()
        {
            
            _path = Path.Combine(HttpContext.Current.Server.MapPath("~/App_Data"), fileName);
        }

        public List<Location> GetData()
        {

            if (System.IO.File.Exists(_path))
                return JsonConvert.DeserializeObject<List<Location>>(System.IO.File.ReadAllText(_path));

            return GetList();
        }

        public void SaveData(IList<Location> data)
        {
            using (StreamWriter file = System.IO.File.CreateText(_path))
            {
                JsonSerializer serializer = new JsonSerializer();
                serializer.Serialize(file, data);
            }
        }

        private List<Location> GetList()
        {
            return new List<Location> { new Location { Date= "27", Month = "June", Year= "2017",Address="Emirates stadium" , Postcode="N77AJ" , Lat =51.5541 , Long = -01.10878}, new Location { Date = "28", Month = "June", Year = "2017", Address = "Emirates stadium", Postcode = "N77AJ", Lat = 51.5541, Long = -01.10878 } };
        }
    }
}