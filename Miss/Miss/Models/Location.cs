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

        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime Date { get; set; }

        public string Address { get; set; }

        [RegularExpression("(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY])))) [0-9][A-Z-[CIKMOV]]{2})")]
        public string Postcode { get; set; }

        [RegularExpression(@"^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$")]
        public double Lat { get; set; }

        [RegularExpression(@"^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$")]
        public double Long { get; set; }

    }
}