﻿using Miss.DataService;
using Miss.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
            return View(_locDataService.GetData());
        }

        // GET: Location/Details/5
        public ActionResult Details(int id)
        {
            return View(_locDataService.GetData().Where(x=> x.Id == id));
        }

        // GET: Location/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Location/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Location collection)
        {
            try
            {
                // TODO: Add insert logic here

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
            return View(_locDataService.GetData().Where(x => x.Id == id));
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
            return View();
        }

        // POST: Location/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
