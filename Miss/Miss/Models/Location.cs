using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Miss.Models
{
    public class Location
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Address { get; set; }
        public string Postcode { get; set; }
        public double Lat { get; set; }
        public double Long { get; set; }

    }
}