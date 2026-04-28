function CollectionTable({ cards }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Set</th>
            <th>Mana Cost</th>
            <th>Type</th>
            <th>Rarity</th>
            <th>P / T</th>
            <th>Foil</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={`${card.cardId}-${card.isFoil}`} className={`rarity-${card.rarity}`}>
              <td className="img-cell">
                {card.imageNormal
                  ? <img src={card.imageNormal} alt={card.name} />
                  : <span className="no-image">—</span>
                }
                {card.imageNormalBack &&
                  <img src={card.imageNormalBack} alt={`${card.name} (back)`} />
                }
              </td>
              <td className="name-cell">{card.name}</td>
              <td>{card.setCode.toUpperCase()}<br /><span className="set-name">{card.setName}</span></td>
              <td className="mana">{card.manaCost ?? '—'}</td>
              <td>{card.typeLine}</td>
              <td className="rarity-cell">{card.rarity}</td>
              <td>{card.power != null ? `${card.power} / ${card.toughness}` : '—'}</td>
              <td>{card.isFoil ? '✦ Yes' : 'No'}</td>
              <td className="qty">{card.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CollectionTable
