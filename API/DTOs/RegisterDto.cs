using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(30, MinimumLength = 3)]
    public required string Username { get; set; }

    [Required]
    public required string KnownAs { get; set; }

    [Required]
    public required string Gender { get; set; }

    [Required]
    public required string DateOfBirth { get; set; }

    [Required]
    public required string City { get; set; }

    [Required]
    public required string Country { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 8)]
    public required string Password { get; set; }
}