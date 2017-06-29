using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Miss.Models
{
    public class Location
    {
        public string Date { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string Address { get; set; }
        public string  Postcode { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }

    }
}