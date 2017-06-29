using Miss.DataService;
using Miss.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Miss.Controllers
{
    public class LocationController : Controller
    {

        IDataService _locDataService;
        public LocationController()
        {
            _locDataService = new LocationDataService();
        }

        // GET: Location
        public ActionResult Index()
        {
            return View(_locDataService.GetData().OrderByDescending(x=>x.Date));
        }

        // GET: Location/Details/5
        public ActionResult Details(int id)
        {
            return View(_locDataService.GetData().Where(x=> x.Id == id).Single());
        }

        // GET: Location/Create
        public ActionResult Create()
        {
            return View(new Location());
        }

        // POST: Location/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Location location)
        {
            try
            {
                List<Location> locs = _locDataService.GetData();

                //Set Id manually
                location.Id = (locs.OrderBy(x=>x.Id).Single().Id + 1);

                locs.Add(location);

                _locDataService.SaveData(locs);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Location/Edit/5
        public ActionResult Edit(int id)
        {
            return View(_locDataService.GetData().Where(x => x.Id == id).Single());
        }

        // POST: Location/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Location location)
        {
            try
            {
                List<Location> locs = _locDataService.GetData();

                // Remove the old item
                Location item = locs.Single(x => x.Id == location.Id);
                locs.Remove(item);
                locs.Add(location);

                _locDataService.SaveData(locs);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Location/Delete/5
        public ActionResult Delete(int id)
        {
            try
            { 
            List<Location> locs = _locDataService.GetData();

            _locDataService.SaveData(locs.Where(x => x.Id != id).ToList());

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public JsonResult GetBusLocation(string lat, string lng)
        {
            if (string.IsNullOrEmpty(lat) && string.IsNullOrEmpty(lng))
            {

                return Json(new
                {
                    Msg = "Not data found",
                    Data = ""
                });
            }

            double latitude, longitude;

            double.TryParse(lat, out latitude);
            double.TryParse(lng, out longitude);

            var data = _locDataService.GetData().Where(x => x.Lat == latitude && x.Long == longitude);

            return Json(new
            {
                Msg = "",
                Data = data
            });
        }

    }
}
