using Miss.DataService;
using Miss.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Miss.Controllers
{
    public class HomeController : Controller
    {
        IDataService _locDataService;

        public HomeController()
        {
            _locDataService = new LocationDataService();
        }

        

        public ActionResult Index()
        {
           
            var model = _locDataService.GetData();
            _locDataService.SaveData(model);

            return View(model);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

    }
}